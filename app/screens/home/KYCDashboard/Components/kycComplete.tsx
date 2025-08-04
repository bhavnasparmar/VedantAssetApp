import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { PermissionsAndroid, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import Wrapper from '../../../../ui/wrapper';
import Spacer from '../../../../ui/spacer';
import CusText from '../../../../ui/custom-text';
import CusButton from '../../../../ui/custom-button';
import Header from '../../../../shared/components/Header/Header';
import { borderRadius, colors, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import { showToast, toastTypes } from '../../../../services/toastService';
import { API_URL, getKYC_Details, IMAGE_API_URL, setKYC_Details, updateObjectKey } from '../../../../utils/Commanutils';
import { completeKycApi, completeKycFinalApi, CreateKYCInvsSignZy, registerFinalKYCApi, saveAadharPDFApi } from '../../../../api/homeapi';

import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const KycComplete = ({ setSelectedTab }: any) => {
    const navigation: any = useNavigation();
    const [userData, setUserData] = useState<any>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signZyData, setSignZyData] = useState<any>({});
    const [adharData, setAdharData] = useState<any>({});
    const [fileName, setFileName] = useState<any>('');
    const [contractErrorDownload, setContractErrorDownload] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);
    //  const [signZyData, setSignZydata] = useState<any>(null);

    useEffect(() => {
        const kycDetails = getKYC_Details();
        kycSignZyStatus()
    }, []);

    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_Details()?.user_basic_details?.signzy_kyc_id
            }

            const [result, error]: any = await CreateKYCInvsSignZy(payload)

            if (result) {
                setSignZyData(result?.data)
                saveAadharPDF(result?.data)
            } else {
                console.log('kycSignZyStatus Error : ', error)
                showToast(toastTypes.error, error)
            }
        } catch (error: any) {

            console.log('kycSignZyStatus Catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }
    const saveAadharPDF = async (data: any) => {
        setContractErrorDownload(false);
        try {
            const payload = {
                userToken: data?.id,
                investor_id: getKYC_Details()?.user_basic_details?.id,
                synzyuserId: data?.userId
            };

            console.log('Save Aadhar PDF payload:', payload);
            const [result, error]: any = await saveAadharPDFApi(payload)
            if (result) {
                console.log('Save Aadhar PDF result:', result?.data?.data?.localFile?.publicUrl);
                setFileName(`${IMAGE_API_URL}${result?.data?.data?.localFile?.publicUrl}`)
                setAdharData(result?.data)
            } else {
                console.log('kycSignZyStatus Error : ', error)
                showToast(toastTypes.error, error)
            }
        } catch (error: any) {
            setContractErrorDownload(true);
            console.log('Save Aadhar PDF error:', error);
            showToast(toastTypes.error, 'Failed to save PDF');
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            if (fileName) {
                // Request storage permission for Android
                if (Platform.OS === 'android') {
                    let granted;

                    if (Platform.Version >= 33) {
                        // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE
                        granted = PermissionsAndroid.RESULTS.GRANTED;
                    } else {
                        // Android 12 and below
                        granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                            {
                                title: 'Storage Permission',
                                message: 'App needs storage permission to download files',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                            }
                        );
                    }

                    if (granted === PermissionsAndroid.RESULTS.GRANTED || Platform.Version >= 33) {
                        downloadFile();
                    } else {
                        Alert.alert('Permission Denied', 'Storage permission is required to download files');
                        setIsDownloading(false);
                        return;
                    }
                } else {
                    // iOS
                    downloadFile();
                }
            } else {
                showToast(toastTypes.error, 'No file available for download');
                setIsDownloading(false);
            }
        } catch (error) {
            console.error('Download failed:', error);
            showToast(toastTypes.error, 'Download failed');
            setIsDownloading(false);
        }
    };

    const downloadFile = async () => {
        try {
            const { config, fs } = ReactNativeBlobUtil;

            // Generate timestamp for unique filename
            const timestamp = new Date().getTime();
            const fileExtension = fileName.split('.').pop() || 'pdf';
            const downloadFileName = `KYC_Document_${timestamp}.${fileExtension}`;

            // Get download directory based on platform and Android version
            let downloadDir;
            if (Platform.OS === 'ios') {
                downloadDir = fs.dirs.DocumentDir;
            } else {
                // For Android
                if (Number(Platform.Version) >= 29) {
                    // Android 10+ use scoped storage
                    downloadDir = fs.dirs.DownloadDir;
                } else {
                    // Android 9 and below
                    downloadDir = fs.dirs.LegacyDownloadDir || fs.dirs.DownloadDir;
                }
            }

            const downloadPath = `${downloadDir}/${downloadFileName}`;

            const configOptions: any = Platform.select({
                ios: {
                    fileCache: true,
                    path: downloadPath,
                    notification: true,
                },
                android: {
                    fileCache: true,
                    path: downloadPath,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        mediaScannable: true,
                        title: downloadFileName,
                        description: 'KYC Document Download',
                        path: downloadPath,
                    },
                },
            });

            console.log('Download URL:', fileName);
            console.log('Download Path:', downloadPath);

            const response = await config(configOptions).fetch('GET', fileName);

            if (Platform.OS === 'ios') {
                // For iOS, show success and optionally open the file
                showToast(toastTypes.success, 'File downloaded successfully');

                // Optionally open the downloaded file
                ReactNativeBlobUtil.ios.openDocument(response.path());
            } else {
                // For Android
                console.log('File downloaded to:', response.path());
                showToast(toastTypes.success, 'File downloaded to Downloads folder');
            }

        } catch (error: any) {
            console.error('Download error:', error);
            showToast(toastTypes.error, 'Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                userToken: signZyData?.id,
                investor_id: getKYC_Details()?.user_basic_details?.id,
                synzyuserId: signZyData?.userId
            };

            console.log('payload : ', payload);
            const [result, error]: any = await registerFinalKYCApi(payload)
            if (result) {
                console.log('result:', result?.data);
               
                const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor);
                setKYC_Details(update_data);

                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Main',
                            params: {
                                screen: 'Tabs',
                                params: { screen: 'Dashboard' }
                            }
                        }
                    ]
                });
            } else {
                console.log('handleFinalSubmit Error : ', error)
                showToast(toastTypes.error, error)
            }
            // showToast(toastTypes.success, 'KYC process completed successfully!');


        } catch (error: any) {
            console.log('Final submit error:', error);
            showToast(toastTypes.error, 'Final submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const createContract = async () => {
        try {
            setSubmitLoader(true);

            const payload = {
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId
            };

            const [result, error]: any = await completeKycApi(payload);

            if (result) {
                const generatePayload = {
                    fileName: result.data.object.result.combinedPdf,
                    userToken: signZyData?.id,
                    synzyuserId: signZyData?.userId
                };

                const [finalResult, finalError]: any = await completeKycFinalApi(generatePayload);

                if (finalResult) {
                    const redirectData = finalResult?.data?.object?.result?.url;
                    if (redirectData) {
                        const updatedKycDetails = {
                            ...getKYC_Details(),
                            webview_url: redirectData
                        };
                        setKYC_Details(updatedKycDetails);
                        setSelectedTab('KycWebView');
                    }
                } else {
                    showToast(toastTypes.error, finalError?.msg || 'Failed to generate contract');
                }
            } else {
                showToast(toastTypes.error, error?.msg || 'Failed to create contract');
            }
        } catch (error: any) {
            console.log('Create contract error:', error);
            showToast(toastTypes.error, 'Something went wrong');
        } finally {
            setSubmitLoader(false);
        }
    };

    return (
        <>
            <Header menubtn name={'KYC Complete'} />
            <Spacer y='XS' />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Success Header with Gradient */}
                <LinearGradient
                    colors={[colors.orange, colors.orange]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        marginHorizontal: responsiveWidth(2.5),
                        borderRadius: borderRadius.large,
                        paddingVertical: responsiveHeight(1),
                        paddingHorizontal: responsiveWidth(5),
                        marginBottom: responsiveHeight(2)
                    }}
                >
                    {/* Success Icon with Animation Effect */}
                    <Wrapper position="center" align="center">
                        <Wrapper
                            position="center"
                            align="center"
                            justify="center"
                            width={responsiveWidth(20)}
                            height={responsiveWidth(20)}
                            color={colors.Hard_White}
                            customStyles={{
                                borderRadius: responsiveWidth(10),
                                shadowColor: colors.black,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8
                            }}
                        >
                            <IonIcon
                                name="checkmark"
                                size={responsiveWidth(10)}
                                color={colors.green}
                            />
                        </Wrapper>

                        <Spacer y="XXS" />

                        <CusText
                            text="Verification Successful!"
                            size="M"
                            bold
                            color={colors.Hard_White}
                            position="center"
                        />

                        {/* <Spacer y="S" /> */}

                        <CusText
                            text="Your Aadhaar eSign process has been verified successfully."
                            size="MS"
                            bold
                            color={colors.Hard_White}
                            position="center"
                            customStyles={{
                                textAlign: 'center',
                                lineHeight: 22,
                                opacity: 0.9
                            }}
                        />
                    </Wrapper>
                </LinearGradient>

                {/* Main Content Card */}
                <Wrapper
                    color={colors.Hard_White}
                    position="center"
                    // width={responsiveWidth(95)} 
                    customStyles={{
                        borderRadius: borderRadius.large,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 5,
                        paddingVertical: responsiveHeight(1.5),
                        paddingHorizontal: responsiveWidth(4)
                    }}
                >
                    {/* Verification Steps */}
                    {/* <CusText 
                        text="Verification Steps Completed" 
                        size="M" 
                        bold 
                        color={colors.Hard_Black}
                        position="center"
                        customStyles={{ marginBottom: responsiveHeight(2) }}
                    /> */}

                    {/* Step Cards */}
                    <Wrapper width={responsiveWidth(87)}>
                        {/* Identity Verified */}
                        <Wrapper
                            row
                            align="center"
                            // color={'#f0f9ff'}
                            customStyles={{
                                padding: responsiveWidth(2),
                                borderRadius: borderRadius.medium,
                                marginBottom: responsiveWidth(3),
                                borderLeftWidth: 4,
                                borderLeftColor: colors.orange
                            }}
                        >
                            {/* <Wrapper 
                                position="center" 
                                align="center" 
                                justify="center"
                                width={responsiveWidth(12)} 
                                height={responsiveWidth(12)}
                                color={colors.blue}
                                customStyles={{ borderRadius: responsiveWidth(6) }}
                            >
                                <IonIcon 
                                    name="person-circle" 
                                    size={responsiveWidth(6)} 
                                    color={colors.orange} 
                                />
                            </Wrapper>
                            
                            <Spacer x="M" /> */}

                            <Wrapper >
                                <CusText text="Identity Verified" size="M" bold color={colors.Hard_Black} />
                                <CusText
                                    text="Your identity documents have been successfully verified"
                                    size="S"
                                    color={colors.gray}
                                    customStyles={{ marginTop: 4 }}
                                />
                            </Wrapper>

                            {/* <IonIcon 
                                name="checkmark-circle" 
                                size={responsiveWidth(6)} 
                                color={colors.green} 
                            /> */}
                        </Wrapper>

                        {/* Aadhaar eSign */}
                        <Wrapper
                            row
                            align="center"
                            // color={'#faf5ff'}
                            customStyles={{
                                padding: responsiveWidth(2),
                                borderRadius: borderRadius.medium,
                                marginBottom: responsiveWidth(3),
                                borderLeftWidth: 4,
                                borderLeftColor: colors.orange
                            }}
                        >
                            {/* <Wrapper 
                                position="center" 
                                align="center" 
                                justify="center"
                                width={responsiveWidth(12)} 
                                height={responsiveWidth(12)}
                                color={colors.purple}
                                customStyles={{ borderRadius: responsiveWidth(6) }}
                            >
                                <IonIcon 
                                    name="shield-checkmark" 
                                    size={responsiveWidth(6)} 
                                    color={colors.Hard_White} 
                                />
                            </Wrapper>
                            
                            <Spacer x="M" /> */}

                            <Wrapper flex>
                                <CusText text="Aadhaar eSign" size="M" bold color={colors.Hard_Black} />
                                <CusText
                                    text="Digital signature process completed successfully"
                                    size="S"
                                    color={colors.gray}
                                    customStyles={{ marginTop: 4 }}
                                />
                            </Wrapper>

                            {/* <IonIcon 
                                name="checkmark-circle" 
                                size={responsiveWidth(6)} 
                                color={colors.green} 
                            /> */}
                        </Wrapper>

                        {/* Documents Ready */}
                        <Wrapper
                            row
                            align="center"
                            // color={'#f0fdf4'}
                            customStyles={{
                                padding: responsiveWidth(2),
                                borderRadius: borderRadius.medium,
                                marginBottom: responsiveWidth(4),
                                borderLeftWidth: 4,
                                borderLeftColor: colors.orange
                            }}
                        >
                            {/* <Wrapper 
                                position="center" 
                                align="center" 
                                justify="center"
                                width={responsiveWidth(12)} 
                                height={responsiveWidth(12)}
                                color={colors.green}
                                customStyles={{ borderRadius: responsiveWidth(6) }}
                            >
                                <IonIcon 
                                    name="document-text" 
                                    size={responsiveWidth(6)} 
                                    color={colors.Hard_White} 
                                />
                            </Wrapper>
                            
                            <Spacer x="M" /> */}

                            <Wrapper>
                                <CusText text="Documents Ready" size="M" bold color={colors.Hard_Black} />
                                <CusText
                                    text="All your KYC documents are processed and ready"
                                    size="S"
                                    color={colors.gray}
                                    customStyles={{ marginTop: 4 }}
                                />
                            </Wrapper>

                            {/* <IonIcon 
                                name="checkmark-circle" 
                                size={responsiveWidth(6)} 
                                color={colors.green} 
                            /> */}
                        </Wrapper>
                    </Wrapper>

                    <Spacer y='S' />
                    {/* Action Buttons */}
                    <Wrapper width={responsiveWidth(87)}>
                        {/* {contractErrorDownload ? (
                            <CusButton
                                loading={submitLoader}
                                width={responsiveWidth(87)}
                                height={responsiveHeight(6)}
                                title="Create Contract Again"
                                position="center"
                                radius={borderRadius.medium}
                                onPress={createContract}
                                lgcolor1={colors.orange}
                                lgcolor2={colors.orange}
                                textSize="M"
                                textWeight="bold"
                                iconName="refresh"
                                iconFirst={false}
                                shadow={true}
                            />
                        ) : ( */}
                        <Wrapper>
                            <CusButton
                                loading={isDownloading}
                                width={responsiveWidth(87)}
                                height={responsiveHeight(6)}
                                title={isDownloading ? "Downloading..." : "Download Documents"}
                                position="center"
                                radius={borderRadius.medium}
                                onPress={handleDownload}
                                lgcolor1={colors.blue}
                                lgcolor2={'#3b82f6'}
                                textSize="M"
                                textWeight="bold"
                                iconName="download"
                                iconFirst={false}
                                shadow={true}
                                customStyle={{ marginBottom: responsiveHeight(2) }}
                            />

                            <CusButton
                                loading={isSubmitting}
                                width={responsiveWidth(87)}
                                height={responsiveHeight(6)}
                                title={isSubmitting ? "Submitting..." : "Complete KYC Process"}
                                position="center"
                                radius={borderRadius.medium}
                                onPress={handleFinalSubmit}
                                lgcolor1={colors.green}
                                lgcolor2={'#22c55e'}
                                textSize="M"
                                textWeight="bold"
                                iconName="checkmark-circle"
                                iconFirst={false}
                                shadow={true}
                            />
                        </Wrapper>
                        {/* )} */}
                    </Wrapper>

                    {/* <Spacer y="M" /> */}

                    {/* Additional Info */}
                    {/* <Wrapper 
                        color={'#fef3c7'} 
                        customStyles={{ 
                            padding: responsiveWidth(4),
                            borderRadius: borderRadius.medium,
                            borderWidth: 1,
                            borderColor: '#f59e0b'
                        }}
                    >
                        <Wrapper row align="center">
                            <IonIcon 
                                name="information-circle" 
                                size={responsiveWidth(5)} 
                                color={'#f59e0b'} 
                            />
                            <Spacer x="S" />
                            <Wrapper flex={1}>
                                <CusText 
                                    text="Important: Please download your documents before completing the process. These documents will be required for future reference."
                                    size="S"
                                    color={'#92400e'}
                                    customStyles={{ lineHeight: 18 }}
                                />
                            </Wrapper>
                        </Wrapper>
                    </Wrapper> */}
                </Wrapper>

                <Spacer y="L" />
            </ScrollView>
        </>
    );
};

export default KycComplete;


