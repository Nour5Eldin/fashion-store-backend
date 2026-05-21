import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { addressRepository } from "../repositories";
import { ApiError } from "../utils/ApiError";
import { getParam } from "../utils/request.utils";
export class AddressController {

    getAddresses = asyncHandler(async (req: Request, res: Response) => {
        const addresses = await addressRepository.getUserAddresses(
            req.user!.userId
        );
        res.status(200).json(ApiResponse.ok(addresses));
    });
    createAddress = asyncHandler(async (req: Request, res: Response) => {
        const address = await addressRepository.create({
            ...req.body,
            userId: req.user!.userId,
        });

        res.status(201).json(
            ApiResponse.created(address, "Address added successfully.")
        );
    });
    updateAddress = asyncHandler(async (req: Request, res: Response) => {
        const address = await addressRepository.updateOne(
            { _id: req.params.id, userId: req.user!.userId },
            req.body
        );

        if (!address) throw ApiError.notFound("Address not found.");

        res.status(200).json(
            ApiResponse.ok(address, "Address updated successfully.")
        );
    });
    deleteAddress = asyncHandler(async (req: Request, res: Response) => {
        const deleted = await addressRepository.deleteAddress(
            getParam(req.params.id),
            req.user!.userId
        );

        if (!deleted) throw ApiError.notFound("Address not found.");

        res.status(200).json(
            ApiResponse.ok(null, "Address deleted successfully.")
        );
    });
    setDefault = asyncHandler(async (req: Request, res: Response) => {
        const address = await addressRepository.setDefault(
            getParam(req.params.id),
            req.user!.userId
        );

        if (!address) throw ApiError.notFound("Address not found.");

        res.status(200).json(
            ApiResponse.ok(address, "Default address updated.")
        );
    });
}

export const addressController = new AddressController();