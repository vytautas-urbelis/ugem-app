import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import {router} from "expo-router";

const About = () => {
    return (
        <>
            {/* Close Button */}
            <TouchableOpacity className="mt-10" onPress={() => router.back()}>
                <View style={styles.header}>
                    <Text style={styles.doneText}>Done</Text>
                </View>
            </TouchableOpacity>

            {/* About Content */}
            <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>About uGem</Text>
                    <Text style={styles.description}>
                        uGem is a comprehensive business platform that helps you manage your business needs
                        effectively. Our
                        goal is to provide a streamlined experience for businesses of all sizes to connect with
                        customers, manage
                        campaigns, and track performance with ease.
                    </Text>
                    <Text style={styles.subtitle}>Features:</Text>
                    <Text style={styles.listItem}>• Manage your business profile and details</Text>
                    <Text style={styles.listItem}>• Connect with customers through wall messages</Text>
                    <Text style={styles.listItem}>• Track campaign performance and statistics</Text>
                    <Text style={styles.listItem}>• Get insights and analytics to improve your business</Text>
                </View>
            </ScrollView>
        </>
    );
};

export default About;

// Styles
const styles = StyleSheet.create({
    header: {
        width: "100%",
        margin: 16, // Equivalent to m-4
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: 32, // Equivalent to pr-8
        flexDirection: "row",
    },
    doneText: {
        fontSize: 18, // Equivalent to text-lg
        fontWeight: "500",
    },
    container: {
        backgroundColor: "#fff", // Light gray background for contrast
    },
    contentContainer: {
        padding: 16, // Padding around the content
        alignItems: "center",
    },
    textContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 12, // Rounded corners
        padding: 20, // Padding inside the container
        marginBottom: 16, // Margin at the bottom for spacing
        elevation: 3, // Slight shadow for depth
        shadowColor: "#000", // Shadow color
        shadowOffset: {width: 0, height: 4}, // Shadow offset
        shadowOpacity: 0.1, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        width: Dimensions.get("window").width * 0.9, // 90% of the screen width
    },
    title: {
        fontSize: 24, // Larger title font size
        fontWeight: "bold",
        marginBottom: 12, // Space below the title
        textAlign: "center",
    },
    description: {
        fontSize: 16, // Regular font size for the description
        lineHeight: 22, // Line height for readability
        marginBottom: 12, // Space below the description
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18, // Font size for subtitles
        fontWeight: "bold",
        marginBottom: 8, // Space below the subtitle
        textAlign: "left",
        alignSelf: "flex-start",
    },
    listItem: {
        fontSize: 16, // Regular font size for list items
        lineHeight: 22, // Line height for readability
        marginBottom: 8, // Space below each list item
        textAlign: "left",
        alignSelf: "flex-start",
    },
});
