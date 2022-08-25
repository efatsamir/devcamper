export default class API_Features {
  
  constructor(query, queryString, model) {
    this.query = query;
    this.queryString = queryString;
    this.model = model;
    this.pagination = {}
  }


  filter() {
    // 1A) FILTERING
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach( el => delete queryObj[el]);
    
    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace( /\b(gt|gte|lt|lte)\b/g, match => `$${match}` );

   this.query = this.query.find( JSON.parse(queryStr) );

   return this;

 }


 sort() {
     // 2) SORTING
     if(this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
         // sort ('price ratingsAverage')
     }else {
         // - means descending order so newest comes first
        this.query = this.query.sort('-createdAt'); 
     }

     return this;
 }

 limitFields() {
     // 3) Field Limiting
     if(this.queryString.fields) {
         const fields = this.queryString.fields.split(',').join(' ');
         this.query = this.query.select(fields);
     }

     return this;
 }
 

async paginate() {

     // 4) Pagination
     const page = parseInt(this.queryString.page)  || 1;
     const limit = parseInt(this.queryString.limit)  || 10;

     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;
     const totalDocs =  await this.model.countDocuments();
      
     this.pagination = {
      page: page,
      per_page: limit,
      total_pages: Math.ceil(totalDocs / limit ),
      total_results: totalDocs,
    };

     if(endIndex < totalDocs) {
        this.pagination.next = {
          page: page + 1,
          limit
        };
     } 
     
     if (startIndex > 0) {
      this.pagination.prev = {
        page: page - 1,
        limit
       }
     }

     
     this.query = this.query.skip(startIndex).limit(limit);
     
     return this;
 }










}

