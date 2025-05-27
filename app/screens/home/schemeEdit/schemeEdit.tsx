import { useState } from "react";
import Header from "../../../shared/components/Header/Header";
import Container from "../../../ui/container";
import Wrapper from "../../../ui/wrapper";
import { colors, responsiveHeight, responsiveWidth } from "../../../styles/variables";
import { styles } from "./schemeEditStyles";
import CusText from "../../../ui/custom-text";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Spacer from "../../../ui/spacer";
import { FlatList, TouchableOpacity } from "react-native";

const SchemeEdit = () => {
    const [fundPickerList, setfundPickerList] = useState<any[]>([
        { id: 1 }
    ]);
    const renderItem = ({ item }: any) => {
        return (
            <Wrapper customStyles={styles.innercard}>
                <Wrapper row >
                    {/* <Wrapper width={responsiveWidth(12)}>
                        {
                            isSvg(getSchemeImage(item?.amc_master?.amc_logo)) ?

                                <SvgUri
                                    style={styles.image}
                                    // width="100%"
                                    // height="100%"
                                    uri={getSchemeImage(item?.amc_master?.amc_logo)}
                                />
                                :

                                <Image resizeMode={'contain'} source={{ uri: getSchemeImage(item?.amc_master?.amc_logo) }} style={styles.image} />

                        }
                    </Wrapper> */}

                    <Wrapper>
                        <Wrapper customStyles={{ width: responsiveWidth(48) }}>
                            <Wrapper row width={responsiveWidth(65)} customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                                <CusText text={'Kotak - Emerging Equity (G)'} size='MS' medium customStyles={{ marginTop: responsiveHeight(0.5) }} />
                                <IonIcon name='bar-chart' size={25} color={'#E59F39'} style={{ marginLeft: responsiveWidth(2) }} />
                                {/* <Image resizeMode='contain' source={{ uri: getSchemeImage(item?.amc_master?.amc_logo) }} style={{
                                    height: responsiveHeight(8),
                                    width: responsiveWidth(8)
                                }}></Image> */}
                            </Wrapper>
                        </Wrapper>
                        <Spacer y='XXS' />
                        <Wrapper row>
                            <Wrapper row>
                                {[1, 2, 3, 4, 5].map((items, i) => (
                                    <IonIcon
                                        key={i}
                                        name='star'
                                        size={15}
                                        color={10 > 4 ? '#F9BD36' : 'gray'}
                                        style={{ marginRight: 4 }}
                                    />
                                ))}
                            </Wrapper>
                        </Wrapper>
                        <Spacer y='XXS' />
                    </Wrapper>
                  {/*   <TouchableOpacity style={styles.button} onPress={() => { }}>
                        <Wrapper color={colors.primary} customStyles={styles.button}>
                            <CusText text={'Select'} size="S" color={colors.Hard_White} medium />
                        </Wrapper>
                    </TouchableOpacity> */}
                </Wrapper>
                
                <Spacer y='XXS' />
                <Wrapper row justify="apart">
                    <Wrapper width={responsiveWidth(30)}>
                        <CusText text={'Return (1 mth.)'} color={colors.gray} />

                        <CusText text={99.99 + ' %'} />

                    </Wrapper>
                    <Wrapper width={responsiveWidth(30)}>
                        <CusText text={'Return (3 mth.)'} color={colors.gray} />

                        <CusText text={99.99 + ' %'} />

                    </Wrapper>
                    <Wrapper width={responsiveWidth(30)}>
                        <CusText text={'Return (6 mth.)'} color={colors.gray} />
                        <CusText text={99.99 + ' %'} />
                    </Wrapper>
                </Wrapper>
                <Spacer y='XXS' />
             
                   <Wrapper row>
                    <Wrapper width={responsiveWidth(30)}>
                        <CusText text={'Overall Score'} color={colors.gray} />

                        <CusText text={52635} />
                    </Wrapper>
                    <Wrapper width={responsiveWidth(30)}>
                        <CusText text={'AUM (cr)'} color={colors.gray} />

                        <CusText text={54623} />

                    </Wrapper>

                </Wrapper>
            </Wrapper>
        )
    }
    return (
        <>
            <Header menubtn name={'Suggested Investments'} />
            <Container Xcenter>
                <FlatList
                    keyExtractor={(item: any, index: number) => index.toString()}
                    data={fundPickerList}
                    renderItem={renderItem}
                    // onEndReached={loadMore}
                    onEndReachedThreshold={2}
                    // ListFooterComponent={() => loader && <ActivityIndicator />}
                    // refreshing={loader}
                    // onRefresh={onRefresh}
                    removeClippedSubviews={true}
                    initialNumToRender={5}
                // ListEmptyComponent={() => <NoRecords />}
                />
            </Container>
        </>
    )



}
export default SchemeEdit;
