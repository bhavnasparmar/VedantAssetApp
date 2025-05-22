import React, { useEffect, useState } from "react";
import CusText from "../../../../ui/custom-text";
import Header from "../../../../shared/components/Header/Header";
import Container from "../../../../ui/container";
import Wrapper from "../../../../ui/wrapper";
import { colors, responsiveWidth } from "../../../../styles/variables";
import Spacer from "../../../../ui/spacer";
import { Text, TouchableOpacity } from "react-native";
import NewGoal from "./Components/NewGoal";
import OnGoingGoal from "./Components/OnGoingGoal";
import CompletedGoal from "./Components/CompletedGoal";
import { useIsFocused } from "@react-navigation/native";


const getComponent = (key: string) => {
    const timestamp = new Date().getTime(); // Unique key to force re-render
    switch (key) {
        case 'NewGoal':
            const NewGoal = require('./Components/NewGoal').default;
            return <NewGoal key={`NewGoal-${timestamp}`} />;
        case 'OnGoingGoal':
            const OnGoingGoal = require('./Components/OnGoingGoal').default;
            return <OnGoingGoal key={`OnGoingGoal-${timestamp}`} />;
        case 'CompletedGoal':
            const CompletedGoal = require('./Components/CompletedGoal').default;
            return <CompletedGoal key={`CompletedGoal-${timestamp}`} />;
        default:
            return <Text>Select a component</Text>;
    }
};

const GoalPlanDashboard = () => {

    const isFocused: any = useIsFocused()
    const [activeComponent, setActiveComponent] = useState<string>('NewGoal');

    useEffect(() => {
        setActiveComponent('NewGoal')
    }, [isFocused])



    return (
        <>
            <Header menubtn name="Goal Planning" />
            <Spacer y="S" />
            <Wrapper row position="center" align="center" justify="apart" customStyles={{
                paddingHorizontal: responsiveWidth(1),

            }}>
                <TouchableOpacity onPress={() => setActiveComponent('NewGoal')}>
                    <CusText color={activeComponent === 'NewGoal' ? colors.orange : colors.darkGray} text={'New Goal'} size={activeComponent === 'NewGoal' ? "M" : "SS"} />
                </TouchableOpacity>
                <Wrapper
                    customStyles={{ marginHorizontal: responsiveWidth(1) }}
                    width={responsiveWidth(5)}
                    height={responsiveWidth(0.3)}
                    color="black"
                />
                <TouchableOpacity onPress={() => setActiveComponent('OnGoingGoal')}>
                    <CusText color={activeComponent === 'OnGoingGoal' ? colors.orange : colors.darkGray} position="center" text={'Ongoing'} size={activeComponent === 'OnGoingGoal' ? "M" : "SS"} />
                </TouchableOpacity>
                <Wrapper
                    customStyles={{ marginHorizontal: responsiveWidth(1) }}
                    width={responsiveWidth(5)}
                    height={responsiveWidth(0.3)}
                    color="black"
                />
                <TouchableOpacity onPress={() => setActiveComponent('CompletedGoal')}>
                    <CusText color={activeComponent === 'CompletedGoal' ? colors.orange : colors.darkGray} text={'Completed'} size={activeComponent === 'CompletedGoal' ? "M" : "SS"} />
                </TouchableOpacity>
            </Wrapper>
            <Spacer y="XS" />
            <Wrapper
                customStyles={{ marginHorizontal: responsiveWidth(1) }}
                width={responsiveWidth(100)}
                height={responsiveWidth(0.5)}
                color="rgba(226, 226, 226, 1)"
            />
            <Spacer y="XS" />
            <Wrapper >
                {getComponent(activeComponent)}
            </Wrapper>

        </>
    )

}

export default GoalPlanDashboard