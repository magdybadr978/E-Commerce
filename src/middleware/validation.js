import joi from 'joi'
import { Types } from 'mongoose'
const dataMethods = ['body', 'params', 'query', 'headers', 'file','files']

const validateObjectId = (value, helper) => {

    if (Types.ObjectId.isValid(value)) {
        return true
    } else {
        return helper.message('In-valid objectId')
    }
}
export const generalFields = {

    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net'] }
    }),
    phone: joi
    .string()
    .pattern(new RegExp(/^(01)(0|1|2|5)[0-9]{8}$/))
    .label("enter valid phone number"),
    password: joi.string(),
    cPassword: joi.string().required(),
    id: joi.string().custom(validateObjectId).required(),
    name: joi.string(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

// export const validation = (schema) => {
//     return (req, res, next) => {
//         const validationErr = []
//         dataMethods.forEach(key => {
//             if (schema[key]) {
//                 const validationResult = schema[key].validate(req[key], { abortEarly: false })
//                 if (validationResult.error) {
//                     validationErr.push(validationResult.error.details)
//                 }
//             }
//         });

//         if (validationErr.length) {
//             return res.json({ message: "Validation Err", validationErr })
//         }
//         return next()
//     }
// }


export const validation = ( schema ) => {
  return ( req, res, next ) => {
    const validationErr = [];
    dataMethods.forEach( ( key ) => {
      if ( schema[key] ) {
        const validationResult = schema[key].validate( req[key], {
          abortEarly: false,
        } );

        if ( validationResult.error ) {
          if ( validationResult.error.details ) {
            validationResult.error.details.map( ( detail ) => {
              const dictionary = {};
              if ( detail.context.label.includes( detail.path[0] ) ) {
                dictionary[`${ detail.path[0] }`] = `${ detail.message }`;
              } else {
                dictionary[`${ detail.path[0] }`] = `${ detail.context.label }`;
              }
              validationErr.push( dictionary );
            } );
          }
        }
      }
    } );

    if ( validationErr.length ) {
      return res.status( 400 ).json( { success: false, message: validationErr } );
    }
    return next();
  };
};
