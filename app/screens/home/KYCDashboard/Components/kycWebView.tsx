import React from 'react';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, BackHandler } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Wrapper from '../../../../ui/wrapper';
import Header from '../../../../shared/components/Header/Header';
import { colors, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import { showToast, toastTypes } from '../../../../services/toastService';
import CusText from '../../../../ui/custom-text';
import { getKYC_Details } from '../../../../utils/Commanutils';

const KYCWebView = ({ setSelectedTab }: any) => {
    const route: any = useRoute();
    const navigation: any = useNavigation();
    const [loading, setLoading] = React.useState(true);
    const webViewRef = React.useRef<any>(null);

    // const redirectUrl = route?.params?.url || '';

    const redirectUrl = getKYC_Details()?.webview_url || '';

    // Handle back button
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (webViewRef.current) {
                    webViewRef.current.goBack();
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    );

    const handleNavigationStateChange = (navState: any) => {
        console.log('WebView URL: ', navState);
        console.log('WebView URL 1: ', navState.url);
        // Check if KYC process is completed based on URL patterns
        if (navState.url.includes('kyc-final-process')) {
            showToast(toastTypes.success, 'KYC completed successfully!');
            setSelectedTab('KycComplete');
        }
    };

    const handleError = (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error: ', nativeEvent);
        showToast(toastTypes.error, 'Failed to load page');
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const handleWebViewMessage = (event: any) => {
        // Parse the data if it was stringified in the WebView
        console.log('Received message from WebView:', event);
        const receivedData = JSON.parse(event.nativeEvent.data);
        console.log('Received message from WebView:', receivedData);
        // Process the data as needed
    };

    if (!redirectUrl) {
        return (
            <>
                <Header menubtn name={'KYC Verification'} />
                <Wrapper
                    position="center"
                    align="center"
                    justify="center"
                    height={responsiveHeight(80)}
                >
                    <CusText text="No URL provided" size="M" color={colors.gray} />
                </Wrapper>
            </>
        );
    }

    return (
        <>
            <Header menubtn name={'KYC Verification'} />
            <Wrapper
                color={colors.Hard_White}
                width={responsiveWidth(100)}
                height={responsiveHeight(85)}
            >
                {loading && (
                    <Wrapper

                        align="center"
                        justify="center"
                        width={responsiveWidth(100)}
                        height={responsiveHeight(85)}
                        customStyles={{ zIndex: 1, position: "absolute" }}
                    >
                        <ActivityIndicator size="large" color={colors.primary} />
                    </Wrapper>
                )}

                <WebView
                    ref={webViewRef}
                    source={{ uri: redirectUrl }}
                    style={{ flex: 1 }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onError={handleError}
                    onLoadEnd={handleLoadEnd}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsBackForwardNavigationGestures={true}
                    scalesPageToFit={true}
                    mixedContentMode="compatibility"
                    onMessage={handleWebViewMessage}
                    onShouldStartLoadWithRequest={(request) => {
                        // Allow all requests
                        return true;
                    }}
                />
            </Wrapper>
        </>
    );
};

export default KYCWebView;