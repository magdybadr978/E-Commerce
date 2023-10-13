export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  pagination = (model) => {
    let page = this.queryData.page;
    let size = this.queryData.size;
    if (page <= 0 || !page) {
      page = 1;
    }
    if (size <= 0 || !size) {
      size = 5;
    }
    const skip = size * (page - 1);
    model.count().then((value) => {
      const total = Math.ceil(value / size);
      this.queryData.value = value;
      this.queryData.total = total;
      //console.log({ this: this.queryData });
    });
    this.mongooseQuery.skip(skip).limit(size);

    return this;
  };

  filter = () => {
    const execluded = ["sort", "page", "size", "fields", "searchKey"];
    let queryFields = { ...this.queryData };
    execluded.forEach((ele) => {
      delete queryFields[ele];
    });
    // if you want to replace you must use string
    queryFields = JSON.stringify(queryFields).replace(
      /lte|lt|gt|gte/g,
      (match) => {
        return `$${match}`;
      }
    );
    queryFields = JSON.parse(queryFields);
    this.mongooseQuery.find(queryFields);
    return this;
  };

  sort = () => {
    if (this.queryData.sort) {
      this.mongooseQuery.sort(this.queryData.sort.replace(/,/g, " "));
    }
    return this;
  };

  search = () => {
    if (this.mongooseQuery.searchKey) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.searchKey } },
          { description: { $regex: this.queryData.searchKey } },
        ],
      });
    }
    return this;
  };

  select = () => {
    this.mongooseQuery.select(this.queryData.fields?.replace(/,/g, " "));
    return this;
  };
}
