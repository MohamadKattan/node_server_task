import { query, body, cookie, header, param, checkSchema } from 'express-validator';

const validateQuery = {
    person: {
        isString: query('person').isString(),
        notEmpty: true,
        isLength: {
            options: {
                min: 3,
            },
        },
        escape: query('person').escape(),
    }
}

const validateCreateNewUser = {

    name: {
        notEmpty: {
            errorMessage: 'Name is empty'
        },
        isString: {
            errorMessage: 'Error Format name'
        },
    },

    mail: {
        notEmpty: {
            errorMessage: 'Email is empty'
        },

        isEmail: {
            errorMessage: 'Email format is wrong'
        },

    },

    pass_word: {
        notEmpty: {
            errorMessage: 'PassWord is Empty'
        },

        isString: {
            errorMessage: 'Error Format pass word'
        },

        isStrongPassword: {
            errorMessage: 'Pass word weak choice another'
        },

        isLength: {
            options: {
                min: 8,
                errorMessage: 'Pass word lenght should not be < 8'
            }
        }


    },
    age: {
        notEmpty: {
            errorMessage: 'age is Empty'
        },

        isNumeric: {
            errorMessage: 'age shoud be number'
        }

    },

    country: {
        notEmpty: {
            errorMessage: 'country is Empty'
        },

        isString: {
            errorMessage: 'Error Format country'
        },
    },

}


const validateLogInUser = {
    mail: {
        notEmpty: {
            errorMessage: 'Email is empty'
        },

        isEmail: {
            errorMessage: 'Email format is wrong'
        },

    },
    pass_word: {
        notEmpty: {
            errorMessage: 'PassWord is Empty'
        },

        isString: {
            errorMessage: 'Error Format pass word'
        }
    }
}


const validateUpdateUser = ()=>{
    
    const map = [
        body('name').isString().withMessage('Name format is wrong').optional({ nullable: true }),
        body('mail').isEmail().withMessage('Email format is  wrong').optional({ nullable: true }),
        body('pass_word').isString().isStrongPassword().withMessage('check password').optional({ nullable: true }),
        body('age').isInt().withMessage('age format is wrong').optional({ nullable: true }),
        body('country').isString().withMessage('Country format is wrong').optional({ nullable: true })

    ]
   
  return map;
}

// ORDERS
const validOrder = {
    order_name: {

        notEmpty: {
            errorMessage: 'order Name is Empty'
        },

        isString: {
            errorMessage: 'Error Format order name'
        },

    },

    price: {
        notEmpty: {
            errorMessage: 'price is empty'
        },

        isNumeric: {
            errorMessage: 'price shoud be number'
        }

    },

    quntety: {
        notEmpty: {
            errorMessage: 'quntety is empty'
        },

        isNumeric: {
            errorMessage: 'quntety shoud be number'
        }

    },
    country: {

        notEmpty: {
            errorMessage: 'country is Empty'
        },

        isString: {
            errorMessage: 'Error Format country'
        },

    }

}


const validatorSrv = { validateQuery, validateCreateNewUser, validateLogInUser, validOrder, validateUpdateUser }

export default validatorSrv;