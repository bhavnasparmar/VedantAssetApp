import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, fontSize, marginHorizontal, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import InputField from "../../../../ui/InputField";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import { styles } from "../kycverificationStyles";
// import DateTimePicker from "../../../../ui/datetimePicker";
import Pdf from 'react-native-pdf';
import { showToast, toastTypes } from "../../../../services/toastService";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import DateTimePicker from "../../../../ui/datetimePicker";
import HeaderComponent from "../headercomponent/headercomponent";


const ProofOfIdentity = ({ setSelectedTab, step }: any) => {

    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [scanVisible, setscanVisible] = useState(false);
    const [isscanload, setisscanload] = useState(false);
    const [signZyData, setsignZyData] = useState<any>({});
    const [panImageData, setpanImageData] = useState<any>({});
    const [panDetails, setpanDetails] = useState<any>({});
    const [continueLoading, setcontinueLoading] = useState(false);
    const [fileExt, setfileExt] = useState('');
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    const [Form, setForm] = useState({
        pancardPhoto: '',
        panNumber: '',
        panName: '',
        fatherName: '',
        motherName: '',
        gender: '',
        martial: '',
        dob: 0,
    });
    const [FormError, setFormError] = useState({
        pancardPhoto: '',
        panNumber: '',
        panName: '',
        fatherName: '',
        motherName: '',
        gender: '',
        martial: '',
        dob: '',
    });
    const [gender, setGender] = useState<any[]>([
        {
            id: 1,
            title: 'Male',
            value: "M"
        },
        {
            id: 2,
            title: 'Female',
            value: "F"
        },
        {
            id: 3,
            title: 'Other',
            value: "O"
        }
    ]);
    const [martialStatus, setMartialStatus] = useState<any[]>([
        {
            id: 1,
            title: 'Married',
            value: "MARRIED"
        },
        {
            id: 2,
            title: 'Unmaried',
            value: "UNMARRIED"
        },
        {
            id: 3,
            title: 'Others',
            value: "OTHER"
        }
    ]);
    const { colors }: any = React.useContext(AppearanceContext);
    const isFocused = useIsFocused();
    const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    useEffect(() => {
        getDefaultData()
        getSummeryDetails()
        // if (getNew_User()) {
        //     if (step <= getUserObject()?.newKyc?.last_kyc_step) {
        //         setscanVisible(false)
        //         getSummeryDetails()
        //     }
        // } else {
        //     if (step <= getLoginUserDetails()?.user_basic_details?.last_kyc_step) {
        //         setscanVisible(false)
        //         getSummeryDetails()
        //     }
        // }


        return () => {
            setForm({
                ...Form,
                pancardPhoto: '',
                panNumber: '',
                panName: '',
                fatherName: '',
                motherName: '',
                gender: '',
                martial: '',
                dob: 0,
            });
            setFormError({
                ...Form,
                pancardPhoto: '',
                panNumber: '',
                panName: '',
                fatherName: '',
                motherName: '',
                gender: '',
                martial: '',
                dob: '',
            });
        };
    }, [isFocused]);
    const navigation: any = useNavigation();
    useEffect(() => {
        return () => 
            {}
    }, []);

    const getDefaultData = async () => {
       

    }

    const getSummeryDetails = async () => {
       
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleImagePick = (response: any) => {

        if (response.didCancel != true) {
            let name = response[0]?.name ? response[0]?.name : response?.assets[0]?.fileName;
            const fileExtension = name.split(".").pop().toLowerCase();
            setfileExt(fileExtension)
            if (allowedExtensions.includes(fileExtension)) {
                handleFormChange({ key: 'pancardPhoto', value: response[0]?.uri ? response[0]?.fileCopyUri : response?.assets[0]?.uri })
                setpanImageData(response[0]?.uri ? response[0] : response?.assets[0])
                setscanVisible(true)
            } else {
                showToast(toastTypes.error, 'Unsupported file type. Please upload a jpg, jpeg, png or pdf file.')
            }
        }
    };

    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        handleValidate(isSubmited, values);
    };

    const submit = async () => {
        
    };

    const handleValidate = (flag = false, values: any) => {
        if (!flag) return;
        let isValid = true;
        let data = Form;
        if (values) {
            const { key, value } = values;
            data = { ...data, [key]: value };
        }
        let panNumber = '';
        if (!data?.panNumber) {
            isValid = false;
            panNumber = 'Pan Number is required';
        }
        if (data?.panNumber && !panCardRegex.test(data?.panNumber)) {
            isValid = false;
            panNumber = 'Pan Number is invalid';
        }
        let panName = '';
        if (!data?.panName) {
            isValid = false;
            panName = 'Name is required';
        }
        let fatherName = '';
        if (!data?.fatherName) {
            isValid = false;
            fatherName = 'Father Name is required';
        }
        let motherName = '';
        if (!data?.motherName) {
            isValid = false;
            motherName = 'Mother Name is required';
        }
        let pancardPhoto = '';
        if (!data?.pancardPhoto) {
            isValid = false;
            pancardPhoto = 'Pan Card Photo is required';
        }
        let gender = '';
        if (!data?.gender) {
            isValid = false;
            gender = 'Gender is required';
        }
        let martial = '';
        if (!data?.martial) {
            isValid = false;
            martial = 'Marital Status is required';
        }
        let dob = '';
        if (!data?.dob) {
            isValid = false;
            dob = 'Date of Birth is required';
        }
        setFormError({
            panNumber,
            panName,
            fatherName,
            pancardPhoto,
            motherName,
            gender,
            martial,
            dob,
        });
        return isValid;
    };

    const setflag = (item: any) => {
        if (Form.gender != item.title) {
            handleFormChange({ key: 'gender', value: item.value })
        } else {
            handleFormChange({ key: 'gender', value: '' })
        }
    }

    const setmartialflag = (item: any) => {
        if (Form.martial != item.title) {
            handleFormChange({ key: 'martial', value: item.value })
        } else {
            handleFormChange({ key: 'martial', value: '' })
        }
    }

    const clearData = () => {
        handleFormChange({ key: 'panNumber', value: '' })
        handleFormChange({ key: 'panName', value: '' })
        handleFormChange({ key: 'fatherName', value: '' })
        handleFormChange({ key: 'motherName', value: '' })
        handleFormChange({ key: 'dob', value: '' })
        handleFormChange({ key: 'gender', value: '' })
        handleFormChange({ key: 'martial', value: '' })
    }

    const scan = async () => {
       
    }

    const renderItem = ({ item }: any) => {
        return (
            <>
                <TouchableOpacity
                    onPress={() => { setflag(item) }}
                >
                    <Wrapper customStyles={{
                        borderColor: Form.gender == item.value ? colors.primary : colors.gray,
                        borderWidth: 0.5,
                        borderRadius: borderRadius.small,
                        padding: 4,
                        width: responsiveWidth(25),
                        marginHorizontal: responsiveWidth(2)
                    }}>
                        <CusText text={item?.title} size='SN'
                            position="center" color={colors.black} />
                    </Wrapper>
                </TouchableOpacity>
            </>
        );
    };

    const rendermartialItem = ({ item }: any) => {
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        setmartialflag(item)
                    }}
                >
                    <Wrapper customStyles={{
                        borderColor: Form.martial == item.value ? colors.primary : colors.gray,
                        borderWidth: 0.5,
                        borderRadius: borderRadius.small,
                        padding: 4,
                        width: responsiveWidth(25),
                        marginHorizontal: responsiveWidth(2)
                    }}>
                        <CusText text={item?.title} size='SN'
                            position="center" color={colors.black} />
                    </Wrapper>
                </TouchableOpacity>
            </>
        );
    }

    const headerBackAction = () => {
       
    };

    return (
        <>
            <HeaderComponent name={'KYC Verification'} backAction={() => headerBackAction()} />
            {/* <SubHeader name={'Personal and Proof of Identity'} /> */}
            {/* <LinearGradient
                style={styles.subHeader}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[
                    colors.gradient3,
                    colors.gradient4,
                    colors.gradient5,
                ]}
            >
                <Wrapper row justify="apart" customStyles={styles.HeaderRow}>
                    <CusText position="center" customStyles={styles.subHeaderRow} text={'Personal and Proof of Identity'} color={colors.Hard_white} size='N' />
                </Wrapper>
            </LinearGradient> */}
            <Container Xcenter>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { setModalVisible(true); }}>
                    <Wrapper
                        customStyles={styles.uploadFrame}
                        height={responsiveWidth(35)}
                        borderColor={colors.inputBorder}
                        align="center"
                        justify="center">
                        {
                            Form.pancardPhoto != '' ? null : <View style={[styles.button, { backgroundColor: colors.darkGrayShades }]}><IonIcon disabled name='camera-outline' color={colors.gray} size={30} ></IonIcon></View>
                        }
                        {
                            Form.pancardPhoto != '' ?
                                (
                                    fileExt === 'pdf' ?
                                        <Pdf
                                            trustAllCerts={false}
                                            source={{ uri: Form.pancardPhoto, cache: true }}
                                            style={{ height: responsiveHeight(15), width: responsiveWidth(73) }}
                                            onError={(error) => {
                                                console.error(error);

                                            }}
                                        />
                                        :
                                        <Image
                                            resizeMode="contain"
                                            source={{
                                                uri: Form.pancardPhoto,
                                            }}
                                            height={responsiveWidth(30)}
                                            width={responsiveWidth(84)}
                                            style={{ borderRadius: 10 }}
                                        />
                                )
                                :
                                (
                                    <CusText
                                        text="Take a Photo (PAN Card)"
                                        position="center"
                                        color={colors.gray}
                                    />
                                )
                        }
                    </Wrapper>
                </TouchableOpacity>
                <Spacer y='XXS' />
                <Wrapper row justify={FormError?.pancardPhoto ? 'apart' : 'right'} width={responsiveWidth(87)}>
                    {
                        FormError?.pancardPhoto ?
                            <CusText text={FormError?.pancardPhoto} size='S' color={colors.gray} underline error />
                            :
                            null
                    }
                    {
                        scanVisible ?
                            <CusButton
                                loading={isscanload}
                                radius={borderRadius.ring}
                                width={responsiveWidth(30)}
                                height={responsiveHeight(5)}
                                textWeight="semibold"
                                title="Scan"
                                lgcolor1={colors.primary}
                                lgcolor2={colors.secondry}
                                position="center"
                                onPress={() => { scan() }}
                                textStyle={{ fontSize: fontSize.medium }}
                            />
                            :
                            null
                    }
                </Wrapper>
                <Wrapper position="center">
                    <InputField
                        editable={false}
                        label="PAN number"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your Pan Card Number"
                        value={Form.panNumber}
                        // labelStyle={{ color: colors.gray }}
                        borderColor={colors.gray}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'panNumber', value })
                        }}
                        error={
                            FormError.panNumber
                        }
                    />
                    <InputField
                        label="Name (as per PAN)"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your Name"
                        value={Form.panName}
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'panName', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.panName}
                    />
                    <InputField
                        label="Father's Name"
                        width={responsiveWidth(90)}
                        placeholder="Enter Father's Name"
                        value={Form.fatherName}
                        // labelStyle={{ color: colors.gray }}
                        borderColor={colors.gray}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'fatherName', value })
                        }}
                        error={FormError.fatherName}
                    />
                    <InputField
                        label="Mother's Name"
                        width={responsiveWidth(90)}
                        placeholder="Enter Mother's Name"
                        value={Form.motherName}
                        // labelStyle={{ color: colors.gray }}
                        borderColor={colors.gray}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'motherName', value })
                        }}
                        error={FormError.motherName}
                    />
                    {/* <Spacer y='XS' /> */}
                    {/* <CusText size='S' text="Date of Birth" semibold color={colors.inputLabel} customStyles={{marginLeft: responsiveWidth(2)}} /> */}
                    {/* <Spacer y='XXS' /> */}
                    <DateTimePicker
                        label="Date of Birth"
                        maximum={new Date()}
                        value={Form.dob ? new Date(Form.dob) : undefined}
                        iconColor={colors.black}
                        width={responsiveWidth(90)}
                        borderColor={colors.gray}
                        customStyle={{
                            alignSelf: 'center',
                            borderBottomColor: colors.gray,
                            borderRadius: borderRadius.medium,
                        }}
                        setValue={(value: Date) => {

                            handleFormChange({ key: 'dob', value })
                        }}
                        error={FormError.dob}
                    />
                </Wrapper>
                <Spacer y='XS' />
                {/* <Wrapper
                    customStyles={{ backgroundColor: colors.gray }}
                    height={responsiveHeight(0.1)}
                    position="center"
                    width={responsiveWidth(90)} />
                <Spacer y='XS' />
                <CusText text={'Personal Information'} bold size="SS" /> */}
                <CusText
                    customStyles={{
                        paddingTop: marginHorizontal.extraSmall,
                        paddingBottom: responsiveWidth(2),
                    }}
                    text={'Your Gender'}
                    size="S"
                    color={colors.inputLabel}
                    medium
                />
                <Wrapper>
                    {/* <FlatList
                        data={gender}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={3}
                        scrollEnabled={false}
                    /> */}
                    <Wrapper row>
                        {gender.map((item: any, index: any) =>
                            <>
                                <TouchableOpacity key={index} activeOpacity={0.7}
                                    onPress={() => { setflag(item) }}
                                >
                                    <Wrapper row align="center" customStyles={{
                                        marginRight: responsiveWidth(5)
                                    }}>
                                        <IonIcon name={Form.gender == item.value ? "radio-button-on-outline" : "radio-button-off-outline"} size={20} color={Form.gender == item.value ? colors.primary : colors.gray} style={{ marginRight: 5 }} />
                                        <CusText text={item?.title} size='SN'
                                            position="center" color={Form.gender == item.value ? colors.primary : colors.black} />
                                    </Wrapper>
                                </TouchableOpacity>
                            </>
                        )}
                    </Wrapper>
                    {
                        FormError?.gender ?
                            <CusText text={FormError?.gender} size='S' color={colors.gray} underline error />
                            :
                            null
                    }
                </Wrapper>
                <Spacer y='XXS' />
                <CusText
                    customStyles={{
                        paddingTop: marginHorizontal.extraSmall,
                        paddingBottom: responsiveWidth(2),
                    }}
                    text={'Marital Status'}
                    size="S"
                    color={colors.inputLabel}
                    medium
                />
                <Spacer y='XXS' />
                <Wrapper >
                    {/* <FlatList
                        data={martialStatus}
                        renderItem={rendermartialItem}
                        keyExtractor={item => item.title}
                        scrollEnabled={false}
                        numColumns={3}
                    /> */}
                    <Wrapper row>
                        {martialStatus.map((item: any, index: any) =>
                            <>
                                <TouchableOpacity key={index} activeOpacity={0.7}
                                    onPress={() => {
                                        setmartialflag(item)
                                    }}
                                >
                                    <Wrapper row align="center" customStyles={{
                                        marginRight: responsiveWidth(5)
                                    }}>
                                        <IonIcon name={Form.martial == item.value ? "radio-button-on-outline" : "radio-button-off-outline"} size={20} color={Form.martial == item.value ? colors.primary : colors.gray} style={{ marginRight: 5 }} />
                                        <CusText text={item?.title} size='SN'
                                            position="center" color={Form.martial == item.value ? colors.primary : colors.black} />
                                    </Wrapper>
                                </TouchableOpacity>
                            </>
                        )}
                    </Wrapper>
                    {
                        FormError?.martial ?
                            <CusText text={FormError?.martial} size='S' color={colors.gray} underline error />
                            :
                            null
                    }
                </Wrapper>
                <Spacer y='N' />
                <CusButton
                    loading={continueLoading}
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
                onPickImage={handleImagePick} isVideo={false} />
        </>
    )
}
export default ProofOfIdentity