import { Address, IAddress } from "../models/address.model";
import { BaseRepository } from "./base.repository";

export class AddressRepository extends BaseRepository<IAddress>{
    constructor() {
        super(Address);
    }
    async getUserAddresses(userId: string): Promise<IAddress[]>{
        return this.findMany(
            { userId },
            { sort: { isDefault: -1, createdAt: -1 } }
        );
    }
    async getDefaultAddress(userId: string): Promise<IAddress | null>{
        return this.findOne({ userId, isDefault: true });
    }
    async setDefault(
        addressId: string,
        userId: string,
    ): Promise<IAddress | null> {
        const address = await Address.findOne({
            _id: addressId,
            userId,
        });
        if (!address) return null;
        address.isDefault = true;
        return address.save();
    }
    async deleteAddress(
        addressId: string,
        userId: string
    ): Promise<boolean> {
        const result = await Address.deleteOne({
            _id: addressId,
            userId,
        });
        return result.deletedCount > 0;
    }
    async countUserAddresses(userId: string): Promise<number>{
        return this.countDocuments({ userId });
    }
}
export const addressRepository = new AddressRepository();