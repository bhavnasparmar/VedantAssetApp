import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AppearanceContext } from '../../../../context/AppearanceContext';

import Wrapper from '../../../../ui/wrapper';

import Spacer from '../../../../ui/spacer';
import InputField from "../../../../ui/InputField";
import DropDown from '../../../../ui/dropdown';


import IonIcon from 'react-native-vector-icons/Ionicons';
import Header from '../../../../shared/components/Header/Header';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import CusText from '../../../../ui/custom-text';
import RadioButton from '../../../../ui/radioButton';
import DateTimePicker from '../../../../ui/datetimePicker';
import { CreateKYCInvsSignZy, getAllCountryApi, getAllStateByCountryApi, getOnBoardingListingsApi, saveNomineeDetailsApi, updatePersonalDetailApi, uploadImagesApi, investorSignatureApi, investorPhotoApi, uploadLiveImagesApi, changeKycStepApi, getPersonalDocumentInfoApi } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';
import { getKYC_Details, setKYC_Details, updateObjectKey, getImageUrl } from '../../../../utils/Commanutils';
import ImagePickerModal from '../../../../shared/components/ImagePickerModal';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import detectFaces from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'
import LivePhotoCapture from '../../../../shared/components/LivePhotoCapture';

const InPersonVerification = ({ setSelectedTab }: any) => {
    // const { colors }: any = React.useContext(AppearanceContext);
    const isFocused: any = useIsFocused();
    const [signZyData, setSignZydata] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<any>(null);
    const [signatureImage, setSignatureImage] = useState<string>('');
    const [capturedPhoto, setCapturedPhoto] = useState<string>('');
    const [signatureModalVisible, setSignatureModalVisible] = useState(false);
    const [cameraModalVisible, setCameraModalVisible] = useState(false);
    const [livePhotoCaptureVisible, setLivePhotoCaptureVisible] = useState(false);
    const [isSignatureUploading, setIsSignatureUploading] = useState(false);
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);
    const [documentInfo, setDocumentInfo] = useState<any>(null);
    const [showSignatureSection, setShowSignatureSection] = useState(false);
    const [showPhotoSection, setShowPhotoSection] = useState(false);

    const uploadSignatureImage = async (fileData: any) => {
        try {
            setIsSignatureUploading(true);

            let formData = new FormData();
            formData.append("folder", 'signature');

            // let passObj: any = {
            //     request_type: "updateSignZy",
            //     userToken: signZyData?.id,
            //     synzyuserId: signZyData?.userId,
            //     investor_id: getKYC_Details()?.user_basic_details?.id,
            // };
            // formData.append("formData", JSON.stringify(passObj));

            // Add signature image
            if (fileData) {
                const name = fileData.fileName || fileData.name;

                const signatureImageFile = {
                    name: name,
                    type: fileData.type || 'image/jpeg',
                    uri: fileData.uri,
                };
                formData.append("public_id", name);
                formData.append("FILE", signatureImageFile);
            }

            console.log('Upload Signature FormData:', formData);

            const [result, error]: any = await uploadImagesApi(formData);

            if (result) {
                console.log('Upload Signature Result:', result);

                // Call investor signature API with result data
                const signaturePayload = {
                    filename: result?.data?.fileName,
                    investor_id: getKYC_Details()?.user_basic_details?.id,
                    userToken: signZyData?.id,
                    synzyuserId: signZyData?.userId
                };

                console.log('Investor Signature Payload:', signaturePayload);

                const [signatureResult, signatureError]: any = await investorSignatureApi(signaturePayload);

                if (signatureResult) {
                    console.log('Investor Signature Result:', signatureResult);
                    showToast(toastTypes.success, signatureResult?.msg || 'Signature uploaded successfully');

                    // Update KYC details if needed
                    // if (signatureResult?.data) {
                    //     const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', signatureResult?.data);
                    //     setKYC_Details(update_data);
                    // }
                } else {
                    console.log('Investor Signature Error:', signatureError);
                    showToast(toastTypes.error, signatureError?.msg || 'Failed to process signature');
                }
            } else {
                console.log('Upload Signature Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to upload signature');
                // Reset signature image on error
                setSignatureImage('');
            }
        } catch (error: any) {
            console.log('Upload Signature Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while uploading signature');
            // Reset signature image on error
            setSignatureImage('');
        } finally {
            setIsSignatureUploading(false);
        }
    };

    const handleSignatureUpload = (response: any) => {
        if (response && !response.didCancel && response.assets && response.assets[0]) {
            const fileData = response.assets[0];
            setSignatureImage(fileData.uri);
            setSignatureModalVisible(false);

            // Upload signature to API
            uploadSignatureImage(fileData);
        }
    };

    const uploadPhotoImage = async (fileData: any) => {
        try {
            setIsPhotoUploading(true);

            let formData = new FormData();
            // formData.append("folder", 'photo');

            // Add photo image
            if (fileData) {
                const name = fileData.fileName || fileData.name;

                const photoImageFile = {
                    name: name,
                    type: fileData.type || 'image/jpeg',
                    uri: fileData.uri,
                };
                // formData.append("public_id", name);
                formData.append("photo", photoImageFile);
                formData.append("investor_id", getKYC_Details()?.user_basic_details?.id);
                formData.append("userToken", signZyData?.id);
                formData.append("synzyuserId", signZyData?.userId);
            }

            console.log('Upload Photo FormData:', formData);

            const [result, error]: any = await uploadLiveImagesApi(formData);

            if (result) {
                console.log('Upload Photo Result:', result);

                // Call investor photo API with result data
                // const photoPayload = {
                //     filename: result?.data?.fileName,
                //     investor_id: getKYC_Details()?.user_basic_details?.id,
                //     userToken: signZyData?.id,
                //     synzyuserId: signZyData?.userId
                // };

                // console.log('Investor Photo Payload:', photoPayload);

                // const [photoResult, photoError]: any = await investorPhotoApi(photoPayload);

                // if (photoResult) {
                //     console.log('Investor Photo Result:', photoResult);
                //     showToast(toastTypes.success, photoResult?.msg || 'Photo uploaded successfully');

                //     // Update KYC details if needed
                //     // if (photoResult?.data) {
                //     //     const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', photoResult?.data);
                //     //     setKYC_Details(update_data);
                //     // }
                // } else {
                //     console.log('Investor Photo Error:', photoError);
                //     showToast(toastTypes.error, photoError?.msg || 'Failed to process photo');
                // }
            } else {
                console.log('Upload Photo Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to upload photo');
                // Reset photo on error
                setCapturedPhoto('');
            }
        } catch (error: any) {
            console.log('Upload Photo Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while uploading photo');
            // Reset photo on error
            setCapturedPhoto('');
        } finally {
            setIsPhotoUploading(false);
        }
    };

    const handlePhotoCapture = (response: any) => {
        if (response && !response.didCancel && response.assets && response.assets[0]) {
            const fileData = response.assets[0];
            setCapturedPhoto(fileData.uri);
            setCameraModalVisible(false);

            // Upload photo to API
            uploadPhotoImage(fileData);
        }
    };

    const handleLivePhotoCapture = (photoUri: string) => {
        console.log('Live Photo Capture URI:', photoUri);
        setCapturedPhoto(photoUri);
        setLivePhotoCaptureVisible(false);

        // Create file data object for API upload
        const fileData = {
            uri: photoUri,
            name: `live_photo_${Date.now()}.jpg`,
            type: 'image/jpeg'
        };

        // Upload photo to API
        uploadPhotoImage(fileData);
    };

    const toggleSignatureModal = () => {
        setSignatureModalVisible(!signatureModalVisible);
    };

    const toggleCameraModal = () => {
        setCameraModalVisible(!cameraModalVisible);
    };

    const toggleLivePhotoCapture = () => {
        setLivePhotoCaptureVisible(!livePhotoCaptureVisible);
    };

    useEffect(() => {
        kycSignZyStatus();
        getPersonalDocumentInfo();
    }, [isFocused]);

    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_Details()?.user_basic_details?.signzy_kyc_id
            }
            const [result, error]: any = await CreateKYCInvsSignZy(payload)
            if (result) {
                setSignZydata(result?.data)
            } else {
                console.log('kycSignZyStatus Error : ', error)
                showToast(toastTypes.error, error)
            }
        } catch (error: any) {

            console.log('kycSignZyStatus Catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }

    const getPersonalDocumentInfo = async () => {
        try {
            const investorId = getKYC_Details()?.user_basic_details?.id;

            if (investorId) {
                const [result, error]: any = await getPersonalDocumentInfoApi(investorId);

                if (result?.data) {
                    console.log('Personal Document Info Result:', result?.data);
                    setDocumentInfo(result.data);

                    // Check if signature document exists and set image URL
                    const hasSignature = result.data?.investor_docs?.signature;
                    if (hasSignature) {
                        const signatureUrl: any = getImageUrl('signature', hasSignature);
                        console.log('signatureUrl : ', signatureUrl);
                        setSignatureImage(signatureUrl);
                    }
                    setShowSignatureSection(true); // Always show to allow retake

                    // Check if photo document exists and set image URL
                    const hasPhoto = result.data?.investor_docs?.photo;
                    if (hasPhoto) {
                        const photoUrl: any = getImageUrl('photo', hasPhoto);
                        setCapturedPhoto(photoUrl);
                    }
                    setShowPhotoSection(true); // Always show to allow retake

                } else {
                    console.log('Personal Document Info Error:', error);
                    setShowSignatureSection(true);
                    setShowPhotoSection(true);
                }
            }
        } catch (error: any) {
            console.log('Personal Document Info Catch Error:', error);
            setShowSignatureSection(true);
            setShowPhotoSection(true);
        }
    }

    const handleNext = async () => {
        // Check if both signature and photo are uploaded
        if (!signatureImage) {
            showToast(toastTypes.error, 'Signature is mandatory. Please upload your signature.');
            return;
        }

        if (!capturedPhoto) {
            showToast(toastTypes.error, 'Photo is mandatory. Please capture your photo.');
            return;
        }

        try {
            setIsLoading(true);

            // Update KYC step to indicate in-person verification is complete
            const payload = {
                investor_id: getKYC_Details()?.user_basic_details?.id
            };

            console.log('Change KYC Step Payload:', payload);

            const [result, error]: any = await changeKycStepApi(payload);

            if (result) {
                console.log('Change KYC Step Result:', result);
                showToast(toastTypes.success, result?.msg || 'In-person verification completed successfully');

                // Update KYC details if needed
                if (result?.data) {

                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor_data);
                    setKYC_Details(update_data);
                    setSelectedTab('QuickSummary');
                }

                // Navigate to Quick Summary

            } else {
                console.log('Change KYC Step Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to update KYC step');
            }
        } catch (error: any) {
            console.log('Change KYC Step Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while updating KYC step');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header menubtn name={'Initial On-Boarding'} />
            <Spacer y='XS' />
            <Wrapper color={colors.Hard_White} position="center" width={responsiveWidth(95)} height={responsiveHeight(85)} customStyles={{ borderRadius: borderRadius.medium }}>
                <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                    <CusText size="SS" medium text={'Initiate On-boarding'} />
                </Wrapper>
                <Wrapper
                    position='center'
                    customStyles={{
                        height: 2,
                        width: responsiveWidth(90),
                        backgroundColor: colors.fieldborder,
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Previous sections status */}
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'PAN Card '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(40)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('PersonalInfo') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper position='center' customStyles={{ height: 2, width: responsiveWidth(90), backgroundColor: colors.fieldborder }} />
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'Proof of Address '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(28)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('AddressInfo') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper
                        position='center'

                        customStyles={{
                            height: 2,
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,

                        }}
                    />
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'FATCA '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(45)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('Fatca') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper
                        position='center'

                        customStyles={{
                            height: 2,
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,

                        }}
                    />

                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'Bank Account Detail '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(21)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('BankDetails') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper position='center' customStyles={{ height: 2, width: responsiveWidth(90), backgroundColor: colors.fieldborder }} />
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'Nomination Detail '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(25)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('Nominee') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper position='center' customStyles={{ height: 2, width: responsiveWidth(90), backgroundColor: colors.fieldborder }} />

                    <Spacer y="XXS" />
                    <Wrapper align="center" row customStyles={{ paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" semibold text={'In-Person Verification'} />
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* Upload Signature and Live Photo Capture Section */}
                    <Wrapper row justify="apart" customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(2) }}>
                        {/* Upload Signature Section - Always show with existing signature or upload option */}
                        {showSignatureSection && (
                            <Wrapper width={responsiveWidth(42)} customStyles={{ backgroundColor: colors.lightGray, borderRadius: borderRadius.medium, padding: responsiveWidth(3) }}>
                                <CusText size="SS" semibold text={signatureImage ? 'Retake Signature' : 'Upload Signature'} color={colors.Hard_Black} position="center" />
                                <Spacer y="XS" />

                                <Wrapper align="center" justify="center" height={responsiveHeight(15)} customStyles={{ backgroundColor: colors.Hard_White, borderRadius: borderRadius.small, borderWidth: 1, borderColor: colors.fieldborder, borderStyle: 'dashed' }}>
                                    {signatureImage ? (
                                        <Image
                                            source={{ uri: signatureImage }}
                                            style={{ width: '100%', height: '100%', borderRadius: borderRadius.small }}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <IonIcon name="document-outline" size={responsiveWidth(8)} color={colors.gray} />
                                    )}
                                </Wrapper>

                                <Spacer y="XS" />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setSignatureModalVisible(true)}
                                    disabled={isSignatureUploading}
                                    style={{
                                        backgroundColor: isSignatureUploading ? colors.gray : colors.primary1,
                                        paddingVertical: responsiveWidth(2),
                                        borderRadius: borderRadius.small
                                    }}
                                >
                                    {isSignatureUploading ? (
                                        <ActivityIndicator color={colors.Hard_White} size="small" />
                                    ) : (
                                        <CusText size="XXS" semibold text={signatureImage ? 'Retake' : 'Upload Image'} color={colors.Hard_White} position="center" />
                                    )}
                                </TouchableOpacity>
                            </Wrapper>
                        )}

                        {/* Live Photo Capture Section - Always show with existing photo or capture option */}
                        {showPhotoSection && (
                            <Wrapper width={responsiveWidth(42)} customStyles={{ backgroundColor: colors.lightGray, borderRadius: borderRadius.medium, padding: responsiveWidth(3) }}>
                                <CusText size="SS" semibold text={capturedPhoto ? 'Retake Photo' : 'Live Photo Capture'} color={colors.Hard_Black} position="center" />
                                <Spacer y="XS" />

                                <Wrapper align="center" justify="center" height={responsiveHeight(15)} customStyles={{ backgroundColor: colors.Hard_White, borderRadius: borderRadius.small, borderWidth: 1, borderColor: colors.fieldborder, borderStyle: 'dashed' }}>
                                    {capturedPhoto ? (
                                        <Image
                                            source={{ uri: capturedPhoto }}
                                            style={{ width: '100%', height: '100%', borderRadius: borderRadius.small }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <IonIcon name="camera-outline" size={responsiveWidth(8)} color={colors.gray} />
                                    )}
                                </Wrapper>

                                <Spacer y="XS" />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setLivePhotoCaptureVisible(true)}
                                    disabled={isPhotoUploading}
                                    style={{
                                        backgroundColor: isPhotoUploading ? colors.gray : colors.primary1,
                                        paddingVertical: responsiveWidth(2),
                                        borderRadius: borderRadius.small
                                    }}
                                >
                                    {isPhotoUploading ? (
                                        <ActivityIndicator color={colors.Hard_White} size="small" />
                                    ) : (
                                        <CusText size="XXS" semibold text={capturedPhoto ? 'Retake' : 'Capture Photo'} color={colors.Hard_White} position="center" />
                                    )}
                                </TouchableOpacity>
                            </Wrapper>
                        )}
                    </Wrapper>

                    {/* Show completion message if both documents exist */}
                    {/* {!showSignatureSection && !showPhotoSection && (
                        <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(4) }}>
                            <Wrapper
                                position="center"
                                color={colors.green + '20'}
                                customStyles={{
                                    borderRadius: borderRadius.medium,
                                    paddingVertical: responsiveHeight(3),
                                    borderWidth: 1,
                                    borderColor: colors.green
                                }}
                            >
                                <IonIcon name="checkmark-circle" size={responsiveWidth(12)} color={colors.green} />
                                <Spacer y="S" />
                                <CusText
                                    text="Documents Uploaded Successfully"
                                    size="L"
                                    semibold
                                    color={colors.green}
                                    position="center"
                                />
                                <Spacer y="XS" />
                                <CusText
                                    text="Your signature and photo have been uploaded and verified."
                                    size="M"
                                    color={colors.gray}
                                    position="center"
                                    customStyles={{ textAlign: 'center' }}
                                />
                            </Wrapper>
                        </Wrapper>
                    )} */}

                    <Spacer y="S" />

                    {/* Next Button */}
                    <Wrapper position='center' row align='center' justify='center' customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={handleNext} disabled={isLoading}>
                            <Wrapper width={responsiveWidth(80)} color={isLoading ? colors.gray : colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5) }}>
                                {isLoading ? (
                                    <ActivityIndicator color={colors.Hard_White} size="small" />
                                ) : (
                                    <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                                )}
                            </Wrapper>
                        </TouchableOpacity>
                    </Wrapper>
                    <Spacer y="XXS" />
                </ScrollView>
            </Wrapper>
            <ImagePickerModal
                visible={signatureModalVisible}
                onClose={toggleSignatureModal}
                onPickImage={handleSignatureUpload}
                isVideo={false}
            />
            <ImagePickerModal
                visible={cameraModalVisible}
                onClose={toggleCameraModal}
                onPickImage={handlePhotoCapture}
                isVideo={false}
            />
            <LivePhotoCapture
                visible={livePhotoCaptureVisible}
                onClose={toggleLivePhotoCapture}
                onPhotoCapture={handleLivePhotoCapture}
                title="Live Photo Capture"
                subtitle="Position your face in the frame and tap capture"
            />
        </>
    );
};

export default InPersonVerification;
