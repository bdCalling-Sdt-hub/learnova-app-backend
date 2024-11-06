import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiErrors'
import { IRule } from './rule.interface'
import { Rule } from './rule.model'

//terms and conditions
const createTermsAndConditionToDB = async (payload: IRule) => {

    const isExistTerms = await Rule.findOne({ type: 'terms' })
    if (isExistTerms) {
        const result = await Rule.findOneAndUpdate({type: 'terms'}, {content: payload?.content}, {new: true})
        const message = "Terms And Condition Updated successfully"
        return { message, result }
  
    } else {
        const result = await Rule.create({ ...payload, type: 'terms' });
        const message = "Terms And Condition Created Successfully"
        return { message, result }
    }
}

const getTermsAndConditionFromDB = async () => {
    const result = await Rule.findOne({ type: 'terms' })
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Terms and conditions doesn't  exist!")
    }
    return result
}
  
export const RuleService = {
    createTermsAndConditionToDB,
    getTermsAndConditionFromDB
}  