import asyncHandler from 'express-async-handler';
import { AppError } from '../utils/AppError.js';
import API_Features from './../utils/API_Features.js'




 const getAll = ( Model, populate ) => asyncHandler( async ( req, res, next) => {

   // allow for nested GET reviews on tour (hack)
   let filter = {};
   if (req.params.bootCampId) filter = { bootCamp: req.params.bootCampId };
   else if (req.params.courseId) filter = { course: req.params.courseId };
   
  
   let query;
 
    // EXECUTE QUERY
    const features = await new API_Features( Model.find(filter), req.query, Model )
                          .filter()
                          .sort()
                          .limitFields()
                          .paginate();
    
    query = features.query;
    console.log(features);
   
   
    if(populate) {
      query = features.query.populate(populate);
    }

    const pagination_Results = features.pagination;

    const docs = await query;
  

    res
    .status(200)
    .json({
      success: true,
      results: pagination_Results.total_results,
      pagination: docs.length ? pagination_Results : {},
      data: docs
      
    })
  
})


// @param population object
 const getOne = (Model, populate=null) => asyncHandler( async ( req, res, next) => {
 
  let query = Model.findById(req.params.id);
  if(populate) query = query.populate(populate);


  const doc = await query;
  

   res
    .status(200)
    .json({
     success: true,
     data: doc
   })

})



// @param filterField
 const createOne = (Model, filterField) => asyncHandler ( async ( req, res, next) => {

  if(!req.body.user) req.body.user = req.user.id;
  if(Model.modelName == 'Review') {
    if(!req.body.bootCamp) req.body.bootCamp = req.params.bootCampId;
  }

  if(filterField) {
    const docExists = await Model.findOne()
                          .where(`${filterField}`)
                          .equals(req.body[filterField])
                          .select(`${filterField}`);
   
    if(docExists) {
      return next( 
        new AppError(`${Model.modelName} with the same ${filterField} already exists`, 400)
      );
    }
  }

 
  
  const doc  = await Model.create(req.body);

    res
      .status(201)
      .json({
        success: true,
        data: doc
      })
 
})



 const updateOne = Model => asyncHandler ( async( req, res, next) => {

   // we want the returned data to be the newly updated data => new: true
   // run mongoose validators on update => runValidators: true
   
    const updatedDoc= await Model.findByIdAndUpdate( 
      req.params.id, req.body, { new: true, runValidators: true }
    );


    res
    .status(200)
    .json({
     success: true,
     data: updatedDoc
   })


 
})



 const deleteOne = Model => asyncHandler ( async ( req, res, next) => {

  // const doc = await Model.findById(req.params.id).select('id');
    // this will trigger the pre remove middleware
    // doc.remove();
  // doc.deleteOne();

  await Model.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    success: true,
    data: null
  })


})



export default {
  getAll,
  getOne,
  createOne, 
  updateOne,
  deleteOne
}








  // iti & brad
  //  res.status(200).json({
  //   success: true,
  //   errors: [],
  //   pagination: {
  //     page: 1,
  //     per_page: 6,
  //     total_pages: 10,
  //     total: 60
  //   },
  //   data : BootCamps

  //  })