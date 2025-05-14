import API from "../utils/API";
import { API_URL, endPoints, promiseHandler } from "../utils/Commanutils";

//for categoriers...
export const showCategories = () => {

    const promise = API.get(`${API_URL}${endPoints.showCat}`);
    return promiseHandler(promise);
};

export const showBanner = () => {

    const promise = API.get(`${API_URL}${endPoints.banner}`);
    return promiseHandler(promise);
};
//popular && special offer...
export const showOffer = () => {
    // const promise = API.get(`${API_URL}${endPoints.specialOffer}`);
    const promise = API.get(`${API_URL}${endPoints.specialOffer}?category=${''}&title=${''}&slug=${''}&brandId=${''}&headerId=${''}&page=${''}&limit=${''}&categoryIds=${''}&brandIds=${''}&lowPrice=${''}&highPrice=${''}&priceSorted=${''}`);
    return promiseHandler(promise);
}

export const showProductCat = (category: any) => {
    // console.log(`${API_URL}${endPoints.specialOffer}?category=${category?.category}&title=${category?.title}&slug=${category?.slug}&brandId=${category?.brandId}&headerId=${category?.headerId}&page=${category?.page}&limit=${category?.limit}`)
    const promise = API.get(`${API_URL}${endPoints.specialOffer}?category=${category?.category}&title=${category?.title}&slug=${category?.slug}&brandId=${category?.brandId}&headerId=${category?.headerId}&page=${category?.page}&limit=${category?.limit}&categoryIds=${category?.categoryIds ? category?.categoryIds : ''}&brandIds=${category?.brandIds ? category?.brandIds : ''}&lowPrice=${''}&highPrice=${''}&priceSorted=${category?.priceSorted ? category?.priceSorted : ''}`);
    return promiseHandler(promise);
}

export const getRepeatOrderByIdApi = (ids: any) => {
    const promise = API.get(`${API_URL}${endPoints.repeatOrder}?ids=${ids}`);
    return promiseHandler(promise);
}

//attributes...
export const attributes = () => {
    const promise = API.get(`${API_URL}${endPoints.attribute}`);
    return promiseHandler(promise);
}

export const checkCoupon = () => {
    const promise = API.get(`${API_URL}${endPoints.getCoupon}`);
    return promiseHandler(promise);
}

export const getBrachAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.getBranch}`);
    return promiseHandler(promise);
}

export const getAllAddressAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.getAddress}`);
    return promiseHandler(promise);
}

export const AddAddressAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.AddAddress}`, payload);
    return promiseHandler(promise);
}

export const placeOrderAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.placeOrder}`, payload);
    return promiseHandler(promise);
}

export const placeOrderAPI1 = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.placeOrder}`, payload);
    return promiseHandler(promise);
}

export const viewOrderAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.vieworders}?limit=10&page=1`,);
    return promiseHandler(promise);
}

export const viewOrderDetailsAPI = (id: any) => {
    const promise = API.get(`${API_URL}${endPoints.vieworders}/${id}`,);
    return promiseHandler(promise);
}


export const UpdateAddressAPI = (payload: any) => {
    const promise = API.put(`${API_URL}${endPoints.UpdateAddres}`, payload);
    return promiseHandler(promise);
}

//product details..
export const productDetail = (slug: any) => {
    // const promise = API.get(`${API_URL}${endPoints.productDetail}?slug=${slug}`);
    const promise = API.get(`${API_URL}${endPoints.specialOffer}?category=${''}&title=${''}&slug=${slug}&brandId=${''}&headerId=${''}&page=${''}&limit=${''}&categoryIds=${''}&brandIds=${''}&lowPrice=${''}&highPrice=${''}&priceSorted=${''}`);

    //console.log('slugggg',(`${API_URL}${endPoints.productDetail}?slug=${slug}`));
    return promiseHandler(promise);
}

export const searchProductDetail = (name: any) => {
    const promise = API.get(`${API_URL}${endPoints.productDetail}?title=${name}`);
    //console.log('slugggg',(`${API_URL}${endPoints.productDetail}?slug=${slug}`));
    return promiseHandler(promise);
}
//edit profile..
export const updateProfile = (id: any, payload: any) => {
    const promise = API.put(`${API_URL}${endPoints.updateProfile}/${id}`, payload);
    console.log('api update profile...', (`${API_URL}${endPoints.updateProfile}/${id}`))
    console.log('payload', payload)
    return promiseHandler(promise);
}

export const viewUserDetailsAPI = (id: any) => {
    const promise = API.get(`${API_URL}${endPoints.getUserData}/${id}`,);
    return promiseHandler(promise);
}


//remove address..
export const removeAddressApi = (id: any) => {
    console.log('api update profile...', `${API_URL}${endPoints.removeAdd}/${id}`)
    const promise = API.delete(`${API_URL}${endPoints.removeAdd}/${id}`);
    // console.log("remove address url",(`${API_URL}${endPoints.removeAdd}/${id}`))
    return promiseHandler(promise);
}

//brands..
export const brandApi = (payload: any) => {
    const promise = API.get(`${API_URL}${endPoints.brands}?limit=${payload?.limit}&page=${payload?.page}`);
    return promiseHandler(promise);
}

//Prescription
export const PrescriptionOrderAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.prescriptionOrder}`, payload);
    return promiseHandler(promise);
}

export const SavedPrescriptionAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.savedPrescription}`);
    return promiseHandler(promise);
}

export const getCusOrderAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.cusOrder}`);
    return promiseHandler(promise);
}

// Manage cart
export const getCusIdCartAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.getCartItems}`);
    return promiseHandler(promise);
}

export const AddItemInCartAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.addCartItem}`, payload);
    return promiseHandler(promise);
}

export const UpdateItemInCartAPI = (payload: any) => {
    const promise = API.put(`${API_URL}${endPoints.updateCartItem}`, payload);
    return promiseHandler(promise);
}

export const RemoveItemInCartAPI = (payload: any) => {
    const promise = API.put(`${API_URL}${endPoints.removeCartItem}`, payload);
    return promiseHandler(promise);
}

export const EmptyCartAPI = () => {
    const promise = API.delete(`${API_URL}${endPoints.emptyCart}`);
    return promiseHandler(promise);
}

// rewards

export const getRewardPointstAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.getRewardPoints}`);
    return promiseHandler(promise);
}

// Lab Test API

export const getLabTestListAPI = (payload: any) => {
    // filters=${filtersParam}&limit=${limitData}&page=${currentPage}
    // const promise = API.get(`${API_URL}${endPoints.getLabTestLIst}`);
    const promise = API.get(`${API_URL}${endPoints.getLabTestLIst}?filters=${payload?.filterData}&limit=${payload?.limit}&page=${payload?.page}`);
    return promiseHandler(promise);
}

export const getLabTestDetailsAPI = (id: any) => {
    const promise = API.get(`${API_URL}${endPoints.getLabTestDetails}/${id}`);
    return promiseHandler(promise);
}

export const getSlotsAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.getSlots}`, payload);
    return promiseHandler(promise);
}

export const getLabOrderAPI = () => {
    const promise = API.get(`${API_URL}${endPoints.getOrders}`);
    return promiseHandler(promise);
}


export const createOrderAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.createLabTestOrder}`, payload);
    return promiseHandler(promise);
}

export const createRazorPayReqAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.createRazorPay}`, payload);
    return promiseHandler(promise);
}

export const createRazorPaySuccessAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.createRazorPaySucces}`, payload);
    return promiseHandler(promise);
}

export const createLabTestRazorPayReqAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.createLabRazorPay}`, payload);
    return promiseHandler(promise);
}

export const createLabTestRazorPaySuccessAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.createLabRazorPaySucces}`, payload);
    return promiseHandler(promise);
}


// payment Details

export const getPaymentDetailsAPI = (id: any) => {
    const promise = API.get(`${API_URL}${endPoints.paymentDetails}/${id}`);
    return promiseHandler(promise);
}

export const getLabtestPaymentDetailsAPI = (id: any) => {
    const promise = API.get(`${API_URL}${endPoints.labTespaymentDetails}/${id}`);
    return promiseHandler(promise);
}

export const feedBackAPI = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.feedBack}`, payload);
    return promiseHandler(promise);
}

export const checkUserLocation = (pincode: any) => {
    const promise = API.get(`${API_URL}${endPoints.checkLocation}/${pincode}`);
    return promiseHandler(promise);
}






