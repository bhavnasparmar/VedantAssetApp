import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Container from '../../../ui/container';
import Header from '../../../shared/components/Header/Header';
import Wrapper from '../../../ui/wrapper';
import Spacer from '../../../ui/spacer';
import CusText from '../../../ui/custom-text';
import { colors, responsiveWidth, borderRadius, fontSize } from '../../../styles/variables';
import { showToast, toastTypes } from '../../../services/toastService';
import CusButton from '../../../ui/custom-button';
import DropDown from '../../../ui/dropdown';
import InputField from '../../../ui/InputField';
import DateTimePicker from '../../../ui/datetimePicker';
import IonIcon from 'react-native-vector-icons/Ionicons';

// Registration Modes
const registrationModes = [
    { id: "PN", name: "PAN" },
    { id: "PD", name: "Physical Document" },
    { id: "E", name: "Electronic" },
];

// Account Types
const accountTypes = [
    { id: "SB", name: "Savings Bank" },
    { id: "CA", name: "Current Account" },
    { id: "FD", name: "Fixed Deposit" },
    { id: "RD", name: "Recurring Deposit" },
];

const CreateMandate = () => {
    const navigation = useNavigation();
    const route = useRoute();

    // Get passed data from AccountHolding
    const { applicantData, accountHoldings } = route.params as any;

    // Form state
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
    const [bankAccount, setBankAccount] = useState('');
    const [bankId, setBankId] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [micrCode, setMicrCode] = useState('');
    const [registrationMode, setRegistrationMode] = useState<any>(null);
    const [accountType, setAccountType] = useState<any>(null);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [perDayLimit, setPerDayLimit] = useState('');
    const [loading, setLoading] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState({
        selectedInvestor: '',
        bankAccount: '',
        bankId: '',
        ifscCode: '',
        micrCode: '',
        registrationMode: '',
        accountType: '',
        startDate: '',
        endDate: '',
        perDayLimit: '',
    });

    useEffect(() => {
        // Set default investor if available
        if (applicantData) {
            setSelectedInvestor(applicantData);
        }
    }, [applicantData]);

    const validateForm = () => {
        const newErrors = {
            selectedInvestor: '',
            bankAccount: '',
            bankId: '',
            ifscCode: '',
            micrCode: '',
            registrationMode: '',
            accountType: '',
            startDate: '',
            endDate: '',
            perDayLimit: '',
        };

        let isValid = true;

        if (!selectedInvestor) {
            newErrors.selectedInvestor = 'Please select an investor';
            isValid = false;
        }

        if (!bankAccount.trim()) {
            newErrors.bankAccount = 'Please enter bank account number';
            isValid = false;
        }

        if (!bankId.trim()) {
            newErrors.bankId = 'Please enter bank ID';
            isValid = false;
        }

        if (!ifscCode.trim()) {
            newErrors.ifscCode = 'Please enter IFSC code';
            isValid = false;
        } else if (ifscCode.length !== 11) {
            newErrors.ifscCode = 'IFSC code must be 11 characters';
            isValid = false;
        }

        if (!micrCode.trim()) {
            newErrors.micrCode = 'Please enter MICR code';
            isValid = false;
        } else if (micrCode.length !== 9) {
            newErrors.micrCode = 'MICR code must be 9 digits';
            isValid = false;
        }

        if (!registrationMode) {
            newErrors.registrationMode = 'Please select registration mode';
            isValid = false;
        }

        if (!accountType) {
            newErrors.accountType = 'Please select account type';
            isValid = false;
        }

        if (!startDate) {
            newErrors.startDate = 'Please select start date';
            isValid = false;
        }

        if (!endDate) {
            newErrors.endDate = 'Please select end date';
            isValid = false;
        } else if (startDate && endDate <= startDate) {
            newErrors.endDate = 'End date must be after start date';
            isValid = false;
        }

        if (!perDayLimit.trim()) {
            newErrors.perDayLimit = 'Please enter per day limit';
            isValid = false;
        } else if (isNaN(Number(perDayLimit)) || Number(perDayLimit) <= 0) {
            newErrors.perDayLimit = 'Please enter a valid amount';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreateMandate = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const payload = {
                investor_id: selectedInvestor?.id,
                can_id: selectedInvestor?.can_id || accountHoldings?.[0]?.can_id,
                bank_account: bankAccount,
                bank_id: bankId,
                ifsc_code: ifscCode,
                micr_code: micrCode,
                registration_mode: registrationMode.id,
                account_type: accountType.id,
                start_date: startDate?.toISOString().split('T')[0],
                end_date: endDate?.toISOString().split('T')[0],
                per_day_limit: parseFloat(perDayLimit),
            };

            console.log('Creating mandate with payload:', payload);

            // Here you would call the actual API
            // const response = await createMandateApi(payload);

            // For now, simulate success
            showToast(toastTypes.success, 'Mandate registered successfully');
            navigation.goBack();

        } catch (error: any) {
            console.log('Create mandate error:', error);
            showToast(toastTypes.error, error?.message || 'Failed to register mandate');
        } finally {
            setLoading(false);
        }
    };

    // Create investor list for dropdown
    const investorList = applicantData ? [applicantData] : [];

    return (
        <Container Xcenter bgcolor={colors.bg} contentWidth={responsiveWidth(100)}>
            <Header name="Create Mandate" backBtn />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.iconContainer}>
                            <IonIcon name="document-text" size={responsiveWidth(6)} color={colors.primary1} />
                        </View>
                        <CusText text="Create New Mandate" size="M" bold color={colors.text} />
                        <CusText text="Please fill in all the required details to register your mandate" size="MS" color={colors.subText} customStyles={styles.subtitle} />
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>

                        {/* Investor Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <IonIcon name="person" size={responsiveWidth(5)} color={colors.primary1} />
                                <CusText text="Investor Information" size="M" semibold color={colors.text} customStyles={styles.sectionTitle} />
                            </View>

                            <View >
                                <DropDown
                                    data={investorList}
                                    placeholder="Select Investor"
                                    value={selectedInvestor}
                                    valueField="id"
                                    labelField="name"
                                    label="Select Investor"
                                    onChange={(data: any) => {
                                        setSelectedInvestor(data);
                                        setErrors({ ...errors, selectedInvestor: '' });
                                    }}
                                      labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                placeholdercolor={colors.gray}
                                    // width={responsiveWidth(85)}
                                    error={errors.selectedInvestor}
                                />
                            </View>
                        </View>

                        {/* Bank Details Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <IonIcon name="card" size={responsiveWidth(5)} color={colors.primary1} />
                                <CusText text="Bank Account Details" size="M" semibold color={colors.text} customStyles={styles.sectionTitle} />
                            </View>

                            {/* <View style={styles.fieldContainer}> */}
                            <InputField
                                label="Bank Account Number"
                                placeholder="Enter your bank account number"
                                value={bankAccount}
                                onChangeText={(text: string) => {
                                    setBankAccount(text);
                                    setErrors({ ...errors, bankAccount: '' });
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                width={responsiveWidth(90)}
                                error={errors.bankAccount}
                                keyboardType="numeric"
                                // fieldViewStyle={{
                                //     height: responsiveWidth(11),
                                //     borderRadius: borderRadius.normal
                                // }}
                                // fieldViewStyle={{
                                //     borderColor: 'rgba(152, 162, 179, 1)',
                                //     borderRadius: borderRadius.middleSmall
                                // }}
                                borderColor={colors.placeholderColor}
                            />
                            <Spacer y="XXS" />
                            {/* </View> */}

                            {/* <View style={styles.fieldContainer}> */}
                            <InputField
                                label="Bank ID"
                                placeholder="Enter bank identification number"
                                value={bankId}
                                onChangeText={(text: string) => {
                                    setBankId(text);
                                    setErrors({ ...errors, bankId: '' });
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}

                                width={responsiveWidth(90)}
                                error={errors.bankId}
                                // fieldViewStyle={{
                                //     height: responsiveWidth(11),
                                //     borderRadius: borderRadius.normal
                                // }}
                                // fieldViewStyle={{
                                //     borderColor: 'rgba(152, 162, 179, 1)',
                                //     borderRadius: borderRadius.middleSmall
                                // }}
                                borderColor={colors.placeholderColor}
                            />
                            {/* </View> */}
                            <Spacer y="XXS" />
                            {/* <View style={styles.fieldContainer}> */}
                            <InputField
                                label="IFSC Code"
                                placeholder="Enter 11-character IFSC code"
                                value={ifscCode}
                                onChangeText={(text: string) => {
                                    setIfscCode(text.toUpperCase());
                                    setErrors({ ...errors, ifscCode: '' });
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                width={responsiveWidth(90)}
                                error={errors.ifscCode}
                                maxLength={11}
                                // fieldViewStyle={{
                                //     borderColor: 'rgba(152, 162, 179, 1)',
                                //     borderRadius: borderRadius.middleSmall
                                // }}
                                borderColor={colors.placeholderColor}
                            />
                            {/* </View> */}
                            <Spacer y="XXS" />
                            {/* <View style={styles.fieldContainer}> */}
                            <InputField
                                label="MICR Code"
                                placeholder="Enter 9-digit MICR code"
                                value={micrCode}
                                onChangeText={(text: string) => {
                                    setMicrCode(text);
                                    setErrors({ ...errors, micrCode: '' });
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                width={responsiveWidth(90)}
                                error={errors.micrCode}
                                keyboardType="numeric"
                                maxLength={9}
                                // fieldViewStyle={{
                                //     height: responsiveWidth(11),
                                //     borderRadius: borderRadius.normal
                                // }}
                                //   fieldViewStyle={{
                                //     borderColor: 'rgba(152, 162, 179, 1)',
                                //     borderRadius: borderRadius.middleSmall
                                // }}
                                borderColor={colors.placeholderColor}
                            />
                            {/* </View> */}
                        </View>

                        {/* Registration Details Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <IonIcon name="settings" size={responsiveWidth(5)} color={colors.primary1} />
                                <CusText text="Registration Details" size="M" semibold color={colors.text} customStyles={styles.sectionTitle} />
                            </View>

                            {/* <View style={styles.fieldContainer}> */}
                            <DropDown
                                data={registrationModes}
                                placeholder="Select registration mode"
                                value={registrationMode}
                                valueField="id"
                                labelField="name"
                                label="Registration Mode"
                                onChange={(data: any) => {
                                    setRegistrationMode(data);
                                    setErrors({ ...errors, registrationMode: '' });
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                placeholdercolor={colors.gray}
                                // width={responsiveWidth(90)}
                                error={errors.registrationMode}
                            />
                            {/* </View> */}
                            <Spacer y="XXS" />
                            {/* <View style={styles.fieldContainer}> */}
                            <DropDown
                                data={accountTypes}
                                placeholder="Select account type"
                                value={accountType}
                                valueField="id"
                                labelField="name"
                                label="Account Type"
                                onChange={(data: any) => {
                                    setAccountType(data);
                                    setErrors({ ...errors, accountType: '' });
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                placeholdercolor={colors.gray}
                                // width={responsiveWidth(90)}
                                error={errors.accountType}
                            />
                            {/* </View> */}
                        </View>

                        {/* Validity Period Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <IonIcon name="calendar" size={responsiveWidth(5)} color={colors.primary1} />
                                <CusText text="Validity Period" size="M" semibold color={colors.text} customStyles={styles.sectionTitle} />
                            </View>

                            {/* <View style={styles.fieldContainer}> */}
                            <DateTimePicker
                                label="Start Date"
                                value={startDate}
                                setValue={(date: Date) => {
                                    setStartDate(date);
                                    setErrors({ ...errors, startDate: '' });
                                }}
                                minimum={new Date()}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                placeholder="Select mandate start date"
                                customStyle={{
                                    borderRadius: borderRadius.small,
                                    // width: responsiveWidth(87)
                                }}
                                // width={responsiveWidth(90)}
                                borderColor={colors.gray}
                                error={errors.startDate}
                            />
                            {/* </View> */}
                            <Spacer y="XXS" />
                            {/* <View style={styles.fieldContainer}> */}
                            <DateTimePicker
                                label="End Date"
                                value={endDate}
                                setValue={(date: Date) => {
                                    setEndDate(date);
                                    setErrors({ ...errors, endDate: '' });
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                minimum={startDate || new Date()}
                                customStyle={{
                                    borderRadius: borderRadius.small,
                                    // width: responsiveWidth(87)
                                }}
                                placeholder="Select mandate end date"
                                // width={responsiveWidth(90)}
                                error={errors.endDate}
                            />
                            {/* </View> */}
                        </View>

                        {/* Transaction Limits Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <IonIcon name="wallet" size={responsiveWidth(5)} color={colors.primary1} />
                                <CusText text="Transaction Limits" size="M" semibold color={colors.text} customStyles={styles.sectionTitle} />
                            </View>

                            <View style={styles.fieldContainer}>
                                <InputField
                                    label="Per Day Limit (₹)"
                                    placeholder="Enter maximum daily transaction limit"
                                    value={perDayLimit}
                                    onChangeText={(text: string) => {
                                        setPerDayLimit(text);
                                        setErrors({ ...errors, perDayLimit: '' });
                                    }}
                                    width={responsiveWidth(90)}
                                      labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                               
                                    error={errors.perDayLimit}
                                    keyboardType="numeric"
                                    // fieldViewStyle={{
                                    //     height: responsiveWidth(11),
                                    //     borderRadius: borderRadius.normal
                                    // }}
                                    borderColor={colors.placeholderColor}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <View style={styles.buttonContainer}>
                        <CusButton
                            title={loading ? "Registering Mandate..." : "Register Mandate"}
                            onPress={handleCreateMandate}
                            width={responsiveWidth(90)}
                            loading={loading}
                            disabled={loading}
                            radius={borderRadius.middleSmall}
                            // lgcolor1={colors.primary1}
                            // lgcolor2={colors.primary2}
                        />
                    </View>

                    <Spacer y="XL" />
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollContent: {
        paddingBottom: responsiveWidth(5),
    },
    headerSection: {
        alignItems: 'center',
        paddingVertical: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(2),
        backgroundColor: colors.white,
        marginHorizontal: responsiveWidth(2),
        marginTop: responsiveWidth(1),
        borderRadius: borderRadius.middleSmall,
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: responsiveWidth(13),
        height: responsiveWidth(13),
        borderRadius: borderRadius.ring,
        backgroundColor: colors.primary1 + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveWidth(1),
    },
    subtitle: {
        textAlign: 'center',
        marginTop: responsiveWidth(2),
        lineHeight: responsiveWidth(5),
    },
    formCard: {
        backgroundColor: colors.white,
        marginHorizontal: responsiveWidth(2),
        marginTop: responsiveWidth(2),
        borderRadius: borderRadius.middleSmall,
        padding: responsiveWidth(3),
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    sectionContainer: {
        marginBottom: responsiveWidth(3),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(2),
        paddingBottom: responsiveWidth(0),
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray + '40',
    },
    sectionTitle: {
        marginLeft: responsiveWidth(3),
    },
    fieldContainer: {
        marginBottom: responsiveWidth(6),
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: responsiveWidth(2),
        marginHorizontal: responsiveWidth(4),
    },
});

export default CreateMandate;