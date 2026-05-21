import { Document, Model } from "mongoose";
export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return this.model.insertMany(data) as unknown as T[];
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne(filter).exec() as unknown as Promise<T | null>;
  }

  async findMany(
    filter: Record<string, unknown> = {},
    options: {
      sort?: Record<string, 1 | -1>;
      limit?: number;
      skip?: number;
      select?: string;
      populate?: string | string[];
    } = {}
  ): Promise<T[]> {
    let query = this.model.find(filter);

    if (options.sort)     query = query.sort(options.sort);
    if (options.limit)    query = query.limit(options.limit);
    if (options.skip)     query = query.skip(options.skip);
    if (options.select)   query = query.select(options.select) as typeof query;
    if (options.populate) query = query.populate(options.populate) as typeof query;

    return query.exec() as unknown as Promise<T[]>;
  }

  async countDocuments(filter: Record<string, unknown> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: Record<string, unknown>): Promise<boolean> {
    const doc = await this.model.exists(filter);
    return !!doc;
  }

  async updateById(
    id: string,
    update: Record<string, unknown>,
    options: Record<string, unknown> = { new: true }
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, update, options)
      .exec() as unknown as Promise<T | null>;
  }

  async updateOne(
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
    options: Record<string, unknown> = { new: true }
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, options)
      .exec() as unknown as Promise<T | null>;
  }

  async updateMany(
    filter: Record<string, unknown>,
    update: Record<string, unknown>
  ): Promise<{ modifiedCount: number }> {
    const result = await this.model.updateMany(filter, update).exec();
    return { modifiedCount: result.modifiedCount };
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model
      .findByIdAndDelete(id)
      .exec() as unknown as Promise<T | null>;
  }

  async deleteMany(
    filter: Record<string, unknown>
  ): Promise<{ deletedCount: number }> {
    const result = await this.model.deleteMany(filter).exec();
    return { deletedCount: result.deletedCount };
  }

  async paginate(
    filter: Record<string, unknown> = {},
    options: {
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
      select?: string;
      populate?: string | string[];
    } = {}
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const page  = Math.max(1, options.page  || 1);
    const limit = Math.min(100, options.limit || 20);
    const skip  = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.findMany(filter, {
        sort: options.sort,
        limit,
        skip,
        select: options.select,
        populate: options.populate,
      }),
      this.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}