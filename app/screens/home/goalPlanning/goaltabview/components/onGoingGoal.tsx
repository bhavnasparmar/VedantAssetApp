import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

const OnGoingGoal = ({setVisible, setGoalPlanID, setgoalId}: any) => {
  const navigation: any = useNavigation();
  const isFocused = useIsFocused();
  const [onGoingGoalTypesData, setonGoingGoalTypesData] = useState<any[]>([]);
  const [title, settitle] = useState('');
  const [id, setid] = useState('');
  const [isVisible, setisVisible] = useState<boolean>(false);
  const [loader, setloader] = useState<boolean>(false);
  useEffect(() => {
    onGoingGoalTypes();
  }, [isFocused]);



  return (
    <>
      {/* <Wrapper
        color={colors.darkGray}
        height={responsiveHeight(70)}
        customStyles={{
          borderBottomLeftRadius: borderRadius.medium,
          borderBottomRightRadius: borderRadius.medium,
        }}>
        <FlatList
          data={onGoingGoalTypesData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => <NoRecords />}
        />
      </Wrapper>
      <DeleteAlert
        isVisible={isVisible}
        setisVisible={(value: any) => setisVisible(value)}
        title={title}
        btnCallParent={() => {
          deleteAPI();
        }}
        btnTitle={
          loader ? <ActivityIndicator color={colors.Hard_White} /> : 'Yes'
        }
      /> */}
    </>
  );
};
export default OnGoingGoal;
