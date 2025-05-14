import React from "react";
import { Text, View } from "react-native";
import IonIcon from 'react-native-vector-icons/Ionicons';

import { styles } from "./NoRecordsStyle";
import { AppearanceContext } from "../../../context/appearanceContext";

const NoRecords = ({setHeight,iconSize,iconMarginTop }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    return (
        <View style={[styles.contains,setHeight?{ height: setHeight}:{}]}>
            <View style={[styles.cardDesign,iconMarginTop?{ marginTop: iconMarginTop}:{}]}>
                <IonIcon name='clipboard-outline' color={colors.primary} size={iconSize?iconSize:80} ></IonIcon>
                <Text style={[styles.cardText,{color:colors.primary}]}>
                    No Records
                </Text>

            </View>
        </View>
    )
}
export default NoRecords