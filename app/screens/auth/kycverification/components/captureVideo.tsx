import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { BackHandler, Image, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Pdf from 'react-native-pdf';
import IonIcon from 'react-native-vector-icons/Ionicons';
import VideoPlayer from 'react-native-video';
import { toastTypes } from "../../../../constant/constants";
import { AppearanceContext } from "../../../../context/appearanceContext";
import { showToast } from "../../../../services/toastService";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";
import { borderRadius, fontSize, marginHorizontal, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import HeaderComponent from "../headercomponent/headercomponent";
import { styles } from "../kycverificationStyles";

const CaptureVideo = ({ setSelectedTab, step }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const navigation: any = useNavigation();
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [isvideoUpdate, setisvideoUpdate] = useState<boolean>(false);
    const [isSignatureUpdate, setisSignatureUpdate] = useState<boolean>(false);
    const [isPhotoUpdate, setisPhotoUpdate] = useState<boolean>(false);
    const [videoData, setvideoData] = useState<any>({});
    const [signatureData, setsignatureData] = useState<any>({});
    const [photoData, setphotoData] = useState<any>({});
    const [randomNumber, setrandomNumber] = useState<any>('');
    const [compressFileURI, setcompressFileURI] = useState<any>('');
    const [otpObject, setotpObject] = useState<any>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCountinueLoad, setisCountinueLoad] = useState(false);
    const [isgetOtp, setisgetOtp] = useState(false);
    const [photo, setPhoto] = useState<any>(0);
    const [fileExt, setfileExt] = useState('');
    const [photoExt, setphotoExt] = useState('');
    const [signZyData, setsignZyData] = useState<any>({});
    const [Form, setForm] = useState({
        video: '',
        signature: '',
        passportsizephoto: '',
    });
    const [FormError, setFormError] = useState({
        video: '',
        signature: '',
        passportsizephoto: '',
    });
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf", "mp4"];
    const isFocused = useIsFocused();
    useEffect(() => {

        getDefaultData()
        getSummeryDetails()
        // if (getNew_User()) {
        //     if (step <= getUserObject()?.newKyc?.last_kyc_step) {
        //         getSummeryDetails()
        //     }
        // } else {
        //     if (step <= getLoginUserDetails()?.user_basic_details?.last_kyc_step) {
        //         getSummeryDetails()
        //     }
        // }

        return () => {
            setForm({
                ...Form,
                video: '',
                signature: '',
                passportsizephoto: '',
            });
            setFormError({
                ...Form,
                video: '',
                signature: '',
                passportsizephoto: '',
            });
        };
    }, [isFocused]);



    useEffect(() => {
        const backAction = () => {
            navigation.navigate('KycTrack')
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const getDefaultData = async () => {
        // if (getNew_User()) {

        //     setsignZyData(await getinvestorSignzyLogin(getUserObject()?.newKyc?.signzy_user_name,
        //         getUserObject()?.newKyc?.signzy_kyc_id
        //     ))
        // } else {
        //     setsignZyData(await getinvestorSignzyLogin(getLoginUserDetails()?.user_basic_details?.signzy_user_name,
        //         getLoginUserDetails()?.user_basic_details?.signzy_kyc_id
        //     ))
        // }

    }
    const getSummeryDetails = async () => {
        // try {
        //     const result: any = await API.get('kyc/summaryDetails', {
        //         headers: {
        //             checksum: getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id
        //         }
        //     });
        //     if (result) {

        //         if (result?.data?.IPV_Details?.video) {
        //             handleFormChange({ key: 'video', value: getSummeryImage('video', result?.data?.IPV_Details?.video) })

        //         }

        //         let signatureName = result?.data?.IPV_Details?.signature;
        //         if (signatureName) {
        //             const signaturExtension = signatureName.split(".").pop().toLowerCase();
        //             setfileExt(signaturExtension)
        //             handleFormChange({ key: 'signature', value: getSummeryImage('photo', result?.data?.IPV_Details?.signature) })

        //         }
        //         let name = result?.data?.IPV_Details?.photo;
        //         if (name) {
        //             const fileExtension = name.split(".").pop().toLowerCase();
        //             setphotoExt(fileExtension)
        //             handleFormChange({ key: 'passportsizephoto', value: getSummeryImage('photo', result?.data?.IPV_Details?.photo) })
        //         }
        //     }
        // } catch (error: any) {
        //     console.log('getSummeryDetails catch Error : ', error)
        //     showToast(toastTypes.error, error[0]?.msg)
        // }
    }
    const submit = async () => {

        // const submited = true;
        // setisSubmited(submited);
        // const isValid = handleValidate(submited, null);
        // if (!isValid) return;
        // try {
        //     let formData = new FormData();
        //     let result: any = null;
        //     if (!isvideoUpdate && !isPhotoUpdate && !isSignatureUpdate) {
        //         formData.append("request_type", 'updatesingy');
        //         formData.append("investor_id", getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id);
        //         let payload = {
        //             request_type: 'updatedb',
        //             investor_id: getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id
        //         }
        //         setisCountinueLoad(true)
        //         result = await API.post('kyc/uploadPhoto', payload);
        //         if (result) {
        //             setisCountinueLoad(false)
        //             if (getNew_User()) {
        //                 const update_data = updateObjectKey(getUserObject(), 'newKyc', result?.data)
        //                 setNewUserObject(update_data)
        //             } else {
        //                 const update_data = updateObjectKey(getLoginUserDetails(), 'user_basic_details', result?.data)
        //                 setLoginUserDetails(update_data)
        //             }
        //             showToast(toastTypes.success, result?.msg)
        //             navigation.navigate('QuickSummary')
        //         } else {
        //             setisCountinueLoad(false)
        //             console.log(' Error 1 : ')
        //             showToast(toastTypes.error, 'submit Error 1')
        //         }
        //     } else {
        //         formData.append("userToken", signZyData?.data?.id);
        //         formData.append("synzyuserId", signZyData?.data?.userId);
        //         formData.append("request_type", 'updatesingy');
        //         if (isPhotoUpdate) {
        //             if (photoData != null) {
        //                 const name = photoData.fileName ? photoData.fileName.replace(/\s/g, '') : photoData.name.replace(/\s/g, '');
        //                 let tempName;
        //                 tempName = name.replace(/[()]/g, '_');
        //                 const FRONT_IMAGE: any = {
        //                     name: tempName,
        //                     type: photoData.type,
        //                     uri: photoData.uri,
        //                 };
        //                 formData.append("photo", FRONT_IMAGE);
        //             }
        //         }
        //         if (isSignatureUpdate) {
        //             if (signatureData != null) {
        //                 const name = signatureData.fileName ? signatureData.fileName.replace(/\s/g, '') : signatureData.name.replace(/\s/g, '');
        //                 let tempName;
        //                 tempName = name.replace(/[()]/g, '_');
        //                 const FRONT_IMAGE: any = {
        //                     name: tempName,
        //                     type: signatureData.type,
        //                     uri: signatureData.uri,
        //                 };
        //                 formData.append("signature", FRONT_IMAGE);
        //             }
        //         }
        //         formData.append("investor_id", getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id);
        //         setisCountinueLoad(true)
        //         result = await API.post('kyc/uploadPhoto', formData, {
        //             headers: {
        //                 "Content-Type": "multipart/form-data",
        //             }
        //         });
        //         if (result) {
        //             setisCountinueLoad(false)
        //             if (isvideoUpdate) {
        //                 uploadVideo()
        //             } else {
        //                 setisCountinueLoad(false)
        //                 showToast(toastTypes.success, result?.msg)
        //                 if (getNew_User()) {
        //                     const update_data = updateObjectKey(getUserObject(), 'newKyc', result?.data)
        //                     setNewUserObject(update_data)
        //                 } else {
        //                     const update_data = updateObjectKey(getLoginUserDetails(), 'user_basic_details', result?.data)
        //                     setLoginUserDetails(update_data)
        //                 }
        //                 navigation.navigate('QuickSummary')
        //             }

        //         } else {
        //             setisCountinueLoad(false)
        //             console.log(' Error 1 : ')
        //             showToast(toastTypes.error, 'submit Error 1')
        //         }
        //     }
        // } catch (error: any) {
        //     setisCountinueLoad(false)
        //     console.log('submit catch error : ', error)
        //     showToast(toastTypes.error, error[0].msg)
        // }
    };
    const uploadVideo = async () => {

        // try {
        //     let formData = new FormData();
        //     formData.append("userToken", signZyData?.data?.id);
        //     formData.append("synzyuserId", signZyData?.data?.userId);
        //     formData.append("video_otp", randomNumber);
        //     formData.append("user_id", getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id);
        //     formData.append("request_type", 'startExecutingVideo');
        //     formData.append("matchImage", otpObject?.matchImage);
        //     formData.append("transactionId", otpObject?.VideoSYNRes[0]?.transactionId);
        //     if (videoData != null) {


        //         const name = videoData.fileName ? videoData.fileName.replace(/\s/g, '') : videoData.name.replace(/\s/g, '');

        //         let tempName;
        //         tempName = name.replace(/[()]/g, '_');


        //         const FRONT_IMAGE: any = {
        //             name: tempName,
        //             type: videoData.type,
        //             uri: compressFileURI,
        //         };

        //         formData.append("video", FRONT_IMAGE);
        //     }

        //     setisCountinueLoad(true)
        //     const result: any = await API.post('kyc/uploadVideo', formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         }
        //     });
        //     if (result) {
        //         setisCountinueLoad(false)
        //         showToast(toastTypes.success, result?.msg)
        //         if (getNew_User()) {
        //             const update_data = updateObjectKey(getUserObject(), 'newKyc', result?.data?.investor_data)
        //             setNewUserObject(update_data)
        //         } else {
        //             const update_data = updateObjectKey(getLoginUserDetails(), 'user_basic_details', result?.data?.investor_data)
        //             setLoginUserDetails(update_data)
        //         }
        //         navigation.navigate('QuickSummary')
        //     } else {
        //         setisCountinueLoad(false)
        //         console.log('uploadVideo else Error : ')
        //         showToast(toastTypes.error, 'uploadVideo Error')
        //     }
        // } catch (error: any) {
        //     setisCountinueLoad(false)
        //     console.log('uploadVideo catch error : ', error)
        //     showToast(toastTypes.error, error[0].msg)
        // }

    }

    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        handleValidate(isSubmited, values);
    };

    const handleValidate = (flag = false, values: any) => {
        let isValid = true;
        // if (!flag) return;
        // let isValid = true;
        // let data = Form;
        // if (values) {
        //     const { key, value } = values;
        //     data = { ...data, [key]: value };
        // }

        // let video = '';
        // if (!getLoginUserDetails()?.user_basic_details?.isKYCDone) {
        //     if (!data?.video) {
        //         isValid = false;
        //         video = 'Video is required';
        //     }
        // }

        // let signature = '';
        // if (!data?.signature) {
        //     isValid = false;
        //     signature = 'signature is required';
        // }
        // let passportsizephoto = '';
        // if (!data?.passportsizephoto) {
        //     isValid = false;
        //     passportsizephoto = 'passportsizephoto is required';
        // }

        // setFormError({
        //     video,
        //     signature,
        //     passportsizephoto,
        // });
        return isValid;
    };
    const onReset = () => {
        setForm({
            ...Form,
            video: '',
        });
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const getOtp = async () => {
        // try {
        //     let payload = {
        //         userToken: signZyData?.data?.id,
        //         synzyuserId: signZyData?.data?.userId,
        //         request_type: 'startVideo',
        //         user_id: getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id,
        //     }
        //     setisgetOtp(true)
        //     const result: any = await API.post('kyc/uploadVideo', payload);
        //     if (result) {
        //         setisgetOtp(false)
        //         setotpObject(result?.data)
        //         setrandomNumber(result?.data?.VideoSYNRes[0]?.randNumber)
        //         showToast(toastTypes.success, result?.msg)
        //     } else {
        //         setisgetOtp(false)
        //         showToast(toastTypes.error, 'Some Thing Wrong')
        //     }
        // } catch (error: any) {
        //     setisgetOtp(false)
        //     console.log('getOtp catch error : ', error)
        //     showToast(toastTypes.error, error[0].msg)
        // }
    }

    const recordVideo = () => {
        // if (randomNumber !== '') {
        //     setPhoto(0)
        //     launchCamera(
        //         { mediaType: 'video', saveToPhotos: true },
        //         async (response: any) => {
        //             if (response.didCancel != true) {

        //                 setvideoData(response?.assets[0])

        //                 await Video.compress(
        //                     response?.assets[0]?.uri,
        //                     {
        //                         compressionMethod: "auto",
        //                     },
        //                     (progress) => {

        //                     }
        //                 ).then(async (compressedFileUrl) => {

        //                     let compressedFilePath = compressedFileUrl;
        //                     setcompressFileURI(compressedFilePath)
        //                     handleFormChange({ key: 'video', value: compressedFilePath })


        //                 });

        //             }
        //         }
        //     );
        //     setisvideoUpdate(true)
        // }
        // else {
        //     showToast(toastTypes.info, 'Please generate Otp!!')
        // }
    }

    const handleImagePick = (response: any) => {
        if (response.didCancel != true) {
            let name = response[0]?.name ? response[0]?.name : response?.assets[0]?.fileName;
            const fileExtension = name.split(".").pop().toLowerCase();
            if (allowedExtensions.includes(fileExtension)) {
                if (photo === 0) {
                    handleFormChange({ key: 'video', value: response?.assets[0]?.uri })
                    setvideoData(response[0]?.uri ? response[0] : response?.assets[0])
                }
                if (photo === 1) {
                    setfileExt(fileExtension)
                    handleFormChange({
                        key: 'signature',
                        value: response[0]?.uri ? response[0]?.fileCopyUri : response?.assets[0]?.uri
                    })
                    setsignatureData(response[0]?.uri ? response[0] : response?.assets[0])
                    setisSignatureUpdate(true)
                }
                if (photo === 2) {
                    setphotoExt(fileExtension)
                    handleFormChange({ key: 'passportsizephoto', value: response[0]?.uri ? response[0]?.fileCopyUri : response?.assets[0]?.uri })
                    setphotoData(response[0]?.uri ? response[0] : response?.assets[0])
                    setisPhotoUpdate(true)
                }
            } else {
                showToast(toastTypes.error, 'Unsupported file type. Please upload a jpg, jpeg, png or pdf file.')
            }
        }
    };

    return (
        <>
            <HeaderComponent name={'KYC Verification'} />
            {/* <SubHeader name={'Record Video'} backAction={() => setSelectedTab('bankDetailRoute')} /> */}
            {/* <LinearGradient
                style={styles.subHeader}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[
                    colors.gradient3,
                    colors.gradient4,
                    colors.gradient5,
                ]}>
                <Wrapper row customStyles={styles.HeaderRow}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { setSelectedTab('bankDetailRoute') }}>
                        <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} />
                    </TouchableOpacity>
                    <Wrapper align="center" justify="center" width={responsiveWidth(80)}>
                        <CusText text={'Record Video'} color={colors.Hard_white} size='N' />
                    </Wrapper>

                </Wrapper>
            </LinearGradient> */}
            <Container Xcenter>
                <Spacer y='S' />
                {
                    (false) ?
                        null :
                        <>
                            <Wrapper position="center" align="center" width={responsiveWidth(100)}>
                                <CusText text="Note: First, click Get OTP to retrieve the OTP. After the OTP is displayed, click Record Video and state the OTP in the video." size="S"
                                    customStyles={styles.subtitle} position="center" color={colors.black} />
                            </Wrapper>
                            <Spacer y='XS' />
                            <Wrapper row justify="apart" customStyles={{}}>
                                <Wrapper>
                                    {
                                        randomNumber !== '' ?
                                            <CusButton
                                                customStyle={{ borderRadius: borderRadius.medium }}
                                                width={responsiveWidth(30)}
                                                height={responsiveHeight(4)}
                                                title={randomNumber !== '' && Form.video ? 'Reset Video' : 'Start Video'}
                                                lgcolor1={colors.primary}
                                                lgcolor2={colors.secondry}
                                                onPress={() => { randomNumber !== '' && Form.video ? onReset() : recordVideo() }}
                                            />
                                            : null
                                    }
                                </Wrapper>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { getOtp() }}>
                                    {
                                        randomNumber !== '' ?

                                            <LinearGradient
                                                style={styles.box}
                                                start={{ x: 0, y: 1 }}
                                                end={{ x: 1, y: 0 }}
                                                colors={[
                                                    colors.tertiary,
                                                    colors.quaternary,
                                                ]}>
                                                {
                                                    randomNumber !== '' ? <CusText semibold text={randomNumber} size='SN'
                                                        customStyles={styles.subtitle} position="center" color={colors.black} />
                                                        :
                                                        <CusText text="Get OTP" size='SN'
                                                            customStyles={styles.subtitle} position="center" color={colors.black} />
                                                }
                                            </LinearGradient>
                                            :
                                            <Wrapper customStyles={styles.box} >
                                                {
                                                    randomNumber !== '' ? <CusText text={randomNumber} size='SN'
                                                        customStyles={styles.subtitle} position="center" color={colors.black} />
                                                        :
                                                        <CusText text="Get OTP" size='SN'
                                                            customStyles={styles.subtitle} position="center" color={colors.black} />
                                                }
                                            </Wrapper>
                                    }
                                </TouchableOpacity>
                            </Wrapper>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { randomNumber !== '' ? null : showToast(toastTypes.info, 'Generate OTP First!!') }}>
                                <Wrapper
                                    customStyles={styles.uploadFrame}
                                    height={responsiveWidth(35)}
                                    borderColor={colors.inputBorder}
                                    align="center"
                                    justify="center">
                                    {
                                        Form.video != '' ? null : <View style={[styles.button, { backgroundColor: colors.darkGrayShades }]}><IonIcon name='videocam-outline' color={colors.gray} size={30} ></IonIcon></View>
                                    }
                                    {
                                        Form.video != '' ?
                                            (
                                                <VideoPlayer
                                                    source={{
                                                        uri: Form.video,
                                                    }}
                                                    style={{
                                                        borderRadius: 10,
                                                        height: responsiveWidth(30),
                                                        width: responsiveWidth(84)
                                                    }}
                                                    controls={true}
                                                />
                                            )
                                            :
                                            (

                                                <CusText
                                                    text="Record Your Video"
                                                    position="center"
                                                    color={colors.gray}
                                                />
                                            )
                                    }
                                </Wrapper>
                            </TouchableOpacity>
                            {
                                FormError?.video ?
                                    <CusText text={FormError?.video} size='S' color={colors.gray} underline error />
                                    :
                                    null
                            }
                            <Spacer y='XS' />

                            {/* <Wrapper
                                customStyles={{ backgroundColor: colors.gray }}
                                height={responsiveHeight(0.1)}
                                position="center"
                                width={responsiveWidth(90)} /> */}
                        </>
                }
                <Wrapper>
                    <CusText
                        // position="center"
                        customStyles={{
                            paddingTop: marginHorizontal.XXS,
                        }}
                        text={'Signature'}
                        size="M"
                        color={colors.gray}
                        bold
                    />
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { setModalVisible(true); setPhoto(1) }}>
                        <Wrapper
                            customStyles={styles.uploadFrame}
                            height={responsiveWidth(35)}
                            borderColor={colors.inputBorder}
                            align="center"
                            justify="center">
                            {
                                Form.signature != '' ? null : <View style={[styles.button, { backgroundColor: colors.darkGrayShades }]}><IonIcon disabled name='camera-outline' color={colors.gray} size={30} ></IonIcon></View>
                            }
                            {
                                Form.signature != '' ?
                                    (
                                        fileExt === 'pdf' ?
                                            <Pdf
                                                trustAllCerts={false}
                                                source={{ uri: Form.signature, cache: true }}
                                                style={{ height: responsiveHeight(15), width: responsiveWidth(73) }}
                                                onError={(error: any) => {
                                                    console.error(error);

                                                }}
                                            />
                                            :
                                            <Image
                                                source={{
                                                    uri: Form.signature,
                                                }}
                                                height={responsiveWidth(30)}
                                                width={responsiveWidth(84)}
                                                style={{ borderRadius: 10 }}
                                            />
                                    )
                                    :
                                    (
                                        <CusText
                                            text="Upload a Photo - Signature"
                                            position="center"
                                            color={colors.gray}
                                        />
                                    )
                            }
                        </Wrapper>
                    </TouchableOpacity>
                    {
                        FormError?.signature ?
                            <CusText text={FormError?.signature} size='S' color={colors.gray} underline error />
                            :
                            null
                    }
                </Wrapper>
                <Spacer y='XS' />
                {/* <Wrapper
                    customStyles={{ backgroundColor: colors.gray }}
                    height={responsiveHeight(0.1)}
                    position="center"
                    width={responsiveWidth(90)} /> */}
                <Wrapper>
                    <CusText
                        // position="center"
                        customStyles={{
                            paddingTop: marginHorizontal.XXS,
                        }}
                        text={'Cature or upload or passport size Photo'}
                        size="M"
                        color={colors.gray}
                        bold
                    />
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { setModalVisible(true); setPhoto(2) }}>
                        <Wrapper
                            customStyles={styles.uploadFrame}
                            height={responsiveWidth(35)}
                            borderColor={colors.inputBorder}
                            align="center"
                            justify="center">
                            {
                                Form.passportsizephoto != '' ? null : <View style={[styles.button, { backgroundColor: colors.darkGrayShades }]}><IonIcon disabled name='camera-outline' color={colors.gray} size={30} ></IonIcon></View>
                            }
                            {
                                Form.passportsizephoto != '' ?
                                    (
                                        photoExt === 'pdf' ?
                                            <Pdf
                                                trustAllCerts={false}
                                                source={{ uri: Form.passportsizephoto, cache: true }}
                                                style={{ height: responsiveHeight(15), width: responsiveWidth(73) }}
                                                onError={(error: any) => {
                                                    console.error(error);

                                                }}
                                            />
                                            :
                                            <Image
                                                source={{
                                                    uri: Form.passportsizephoto,
                                                }}
                                                height={responsiveWidth(30)}
                                                width={responsiveWidth(84)}
                                                style={{ borderRadius: 10 }}
                                            />
                                    )
                                    :
                                    (
                                        <CusText
                                            text="Capture Photo"
                                            position="center"
                                            color={colors.gray}
                                        />
                                    )
                            }
                        </Wrapper>
                    </TouchableOpacity>
                    {
                        FormError?.passportsizephoto ?
                            <CusText text={FormError?.passportsizephoto} size='S' color={colors.gray} underline error />
                            :
                            null
                    }
                </Wrapper>
                <Spacer y='S' />
                <CusButton
                    loading={isCountinueLoad}
                    radius={borderRadius.ring}
                    width={responsiveWidth(90)}
                    title="Next"
                    lgcolor1={colors.primary}
                    lgcolor2={colors.secondry}
                    position="center"
                    onPress={() => { submit() }}
                    textStyle={{ fontSize: fontSize.medium }}
                    textWeight="semibold"
                />
            </Container>
            <ImagePickerModal
                visible={isModalVisible}
                onClose={toggleModal}
                onPickImage={handleImagePick} isVideo={photo === 0 ? true : false} />
        </>
    )
}
export default CaptureVideo
