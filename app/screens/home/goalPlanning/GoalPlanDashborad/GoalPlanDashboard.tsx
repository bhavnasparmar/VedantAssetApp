import React, { useState } from "react";
import CusText from "../../../../ui/custom-text";
import Header from "../../../../shared/components/Header/Header";
import Container from "../../../../ui/container";
import Wrapper from "../../../../ui/wrapper";
import { responsiveWidth } from "../../../../styles/variables";
import Spacer from "../../../../ui/spacer";
import { Text, TouchableOpacity } from "react-native";
import NewGoal from "./Components/NewGoal";


const getComponent = (key: string) => {
    const timestamp = new Date().getTime(); // Unique key to force re-render
    switch (key) {
        case 'NewGoal':
            const Component1 = require('./Components/NewGoal').default;
            return <NewGoal key={`Component1-${timestamp}`} />;
        // case 'Component2':
        //     const Component2 = require('./Component2').default;
        //     return <Component2 key={`Component2-${timestamp}`} />;
        // case 'Component3':
        //     const Component3 = require('./Component3').default;
        //     return <Component3 key={`Component3-${timestamp}`} />;
        default:
            return <Text>Select a component</Text>;
    }
};

const GoalPlanDashboard = () => {

    const [activeComponent, setActiveComponent] = useState<string>('NewGoal');

    return (
        <>
            <Header menubtn name="Goal Planning" />
            <Spacer y="S" />
            <Wrapper row position="center" align="center" justify="apart" customStyles={{
                paddingHorizontal: responsiveWidth(1),

            }}>
                <TouchableOpacity onPress={() => setActiveComponent('NewGoal')}>
                    <CusText text={'New Goal'} size="SS" />
                </TouchableOpacity>
                <Wrapper
                    customStyles={{ marginHorizontal: responsiveWidth(1) }}
                    width={responsiveWidth(5)}
                    height={responsiveWidth(0.3)}
                    color="black"
                />
                <CusText text={'Ongoing Goal'} size="SS" />
                <Wrapper
                    customStyles={{ marginHorizontal: responsiveWidth(1) }}
                    width={responsiveWidth(5)}
                    height={responsiveWidth(0.3)}
                    color="black"
                />
                <CusText text={'Completed Goal'} size="SS" />
            </Wrapper>
            <Spacer y="XS" />
            <Wrapper
                customStyles={{ marginHorizontal: responsiveWidth(1) }}
                width={responsiveWidth(100)}
                height={responsiveWidth(0.5)}
                color="rgba(226, 226, 226, 1)"
            />
            <Spacer y="XS" />
            <Wrapper color="red">
                {getComponent(activeComponent)}
            </Wrapper>

        </>
    )

}

export default GoalPlanDashboard