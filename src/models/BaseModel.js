const { db } = require('../config/firebase');

class QueryBuilder {
  constructor(collection, query = {}, type = 'find', id = null) {
    this.collection = collection;
    this.query = query;
    this.type = type;
    this.id = id;
    this.ref = collection;
    this._limit = null;
    this._orderBy = null;
    this._orderDirection = 'asc';
    this._select = null;
    this._populateField = null;

    if (this.type === 'find' || this.type === 'findOne') {
      for (const [key, value] of Object.entries(query)) {
        if (key !== '$or' && typeof value !== 'object') {
          this.ref = this.ref.where(key, '==', value);
        }
      }
    }
  }

  sort(options) {
    if (options) {
      const field = Object.keys(options)[0];
      this._orderBy = field;
      this._orderDirection = options[field] === -1 ? 'desc' : 'asc';
    }
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  populate(field) {
    this._populateField = field;
    return this;
  }

  select(fields) {
    this._select = fields;
    return this;
  }

  _convertTimestamps(data) {
    if (!data) return data;
    const newData = { ...data };
    for (const [key, value] of Object.entries(newData)) {
      if (value && typeof value === 'object' && value.toDate) {
        const date = value.toDate();
        // If it's createdAt or updatedAt, use ISO string (for app's string fields)
        if (key === 'createdAt' || key === 'updatedAt') {
          newData[key] = date.toISOString();
        } else {
          // Others like licenseExpired, lastOnline use Long (Number)
          newData[key] = date.getTime();
        }
      } else if (value instanceof Date) {
        if (key === 'createdAt' || key === 'updatedAt') {
          newData[key] = value.toISOString();
        } else {
          newData[key] = value.getTime();
        }
      }
    }
    return newData;
  }

  async exec() {
    if (!this.collection) return null;

    let result;
    if (this.type === 'findById') {
      const doc = await this.collection.doc(this.id).get();
      if (!doc.exists) return null;
      result = { id: doc.id, ...this._convertTimestamps(doc.data()) };
      if (this._select === '-password') delete result.password;
    } else if (this.type === 'findOne') {
      let finalRef = this.ref;
      const snapshot = await finalRef.limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      result = { id: doc.id, ...this._convertTimestamps(doc.data()) };
      if (this._select === '-password') delete result.password;
    } else {
      let finalRef = this.ref;
      if (this._orderBy) {
        finalRef = finalRef.orderBy(this._orderBy, this._orderDirection);
      }
      if (this._limit) {
        finalRef = finalRef.limit(this._limit);
      }

      const snapshot = await finalRef.get();
      result = snapshot.docs.map(doc => ({ id: doc.id, ...this._convertTimestamps(doc.data()) }));

      if (this._select === '-password') {
        result = result.map(({ password, ...rest }) => rest);
      }
    }

    if (this._populateField && result) {
      const User = require('./User');
      if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          if (item[this._populateField] && typeof item[this._populateField] === 'string') {
            result[i][this._populateField] = await User.findById(item[this._populateField]).exec();
          }
        }
      } else {
        if (result[this._populateField] && typeof result[this._populateField] === 'string') {
          result[this._populateField] = await User.findById(result[this._populateField]).exec();
        }
      }
    }

    return result;
  }

  then(resolve, reject) {
    this.exec().then(resolve).catch(reject);
  }
}

class BaseModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = db ? db.collection(collectionName) : null;
  }

  find(query = {}) {
    return new QueryBuilder(this.collection, query, 'find');
  }

  findOne(query) {
    return new QueryBuilder(this.collection, query, 'findOne');
  }

  findById(id) {
    return new QueryBuilder(this.collection, {}, 'findById', id);
  }

  async create(data) {
    if (!this.collection) return null;
    const now = new Date();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    const ref = await this.collection.add(docData);
    return { id: ref.id, ...docData };
  }

  async findByIdAndUpdate(id, data) {
    if (!this.collection || !id) return null;
    const now = new Date();
    const updateData = { ...data, updatedAt: now };
    delete updateData.id;
    delete updateData._id;

    await this.collection.doc(id).set(updateData, { merge: true });
    return this.findById(id).exec();
  }

  async findByIdAndDelete(id) {
    if (!this.collection || !id) return null;
    const doc = await this.findById(id).exec();
    if (!doc) return null;
    await this.collection.doc(id).delete();
    return doc;
  }

  async updateMany(query, data) {
    if (!this.collection) return { modifiedCount: 0 };

    let ref = this.collection;
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'object' && value.$lt) {
        ref = ref.where(key, '<', value.$lt);
      } else {
        ref = ref.where(key, '==', value);
      }
    }

    const snapshot = await ref.get();
    if (snapshot.empty) return { modifiedCount: 0 };

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { ...data, updatedAt: new Date() });
    });

    await batch.commit();
    return { modifiedCount: snapshot.size };
  }

  async countDocuments(query = {}) {
    if (!this.collection) return 0;
    let ref = this.collection;
    for (const [key, value] of Object.entries(query)) {
      ref = ref.where(key, '==', value);
    }
    const snapshot = await ref.count().get();
    return snapshot.data().count;
  }
}

module.exports = BaseModel;
