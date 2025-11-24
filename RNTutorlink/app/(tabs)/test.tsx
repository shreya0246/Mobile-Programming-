import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
    const [modalVisible, setModalVisible] = useState(false);
    const [count, setCount] = useState(0);

    return (
        <View style={styles.container}>
            {/* Main Button */}
            <TouchableOpacity
                style={styles.openBtn}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.openBtnText}>Open Modal</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalCard}>
                        <Text style={styles.title}>Count: {count}</Text>

                        {/* Increase Count */}
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => setCount(count + 1)}
                        >
                            <Text style={styles.btnText}>Increase Count</Text>
                        </TouchableOpacity>

                        {/* Decrease Count */}
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => setCount(count - 1)}
                        >
                            <Text style={styles.btnText}>Decrease Count</Text>
                        </TouchableOpacity>

                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* Styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",

    },
    openBtn: {
        backgroundColor: "pink",
        padding: 20,
        borderRadius: 10,
    },
    openBtnText: {
        color: "white",
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(186, 241, 255)",
    },
    modalCard: {
        width: 500,
        padding: 50,
        backgroundColor: "white",
        borderRadius: 12,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    actionBtn: {
        backgroundColor: "#0080ff",
        padding: 12,
        width: "100%",
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center",
    },
    btnText: {
        color: "white",
        fontSize: 16,
    },
    closeBtn: {
        borderWidth: 1,
        borderColor: "purple",
        padding: 12,
        width: "100%",
        borderRadius: 8,
        marginTop: 15,
        alignItems: "center",
    },
    closeText: {
        color: "red",
        fontSize: 16,
    },
});
