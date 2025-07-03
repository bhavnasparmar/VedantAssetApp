import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';

const DownloadProgressModal = ({ isVisible, progress }:any) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Downloading PDF</Text>
        <Progress.Bar progress={progress / 100} width={200} /> {/* progress prop takes a value between 0 and 1 */}
        <Text style={styles.progressText}>{`${progress.toFixed(2)}%`}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  progressText: {
    marginTop: 8,
  },
});

export default DownloadProgressModal;