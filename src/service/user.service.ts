import { type FilterQuery, type QueryOptions } from "mongoose";
import { User, type UserDoc, type UserAttrs } from "../model/user.model";

export const buildUser = async (attrs: UserAttrs) => {
  const user = User.build(attrs);
  await user.save();
  return user;
};
export const findUser = async (
  filterQuery: FilterQuery<UserDoc>,
  queryOptions?: QueryOptions<UserDoc>
) => {
  return await User.findOne(filterQuery, queryOptions ?? {});
};
