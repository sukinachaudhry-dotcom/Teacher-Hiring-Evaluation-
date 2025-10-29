import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons, MaterialCommunityIcons, Foundation, Feather, Fontisto } from "@expo/vector-icons";

const Privacy = () => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
            <View style={{ padding: "15", width: "100%", backgroundColor: "#d8b4e2", marginTop:"80"}}>
                <Text style={{ fontWeight: "600", fontSize: 28, marginBottom: 60, textAlign: "center" }}>Privacy Setting</Text>
                <View style={{ padding: 20, marginTop: -25, backgroundColor: "white", borderRadius: 50 }}>
                    <View style={{ width: "100%", padding: "20", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text>   Show my profile to others</Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 15 }}>
                            <Fontisto name="toggle-on" size={30} color="purple" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", padding : "20", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between",marginBottom: 5 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text>   Share my email</Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 15 }}>
                            <Fontisto name="toggle-on" size={30} color="purple" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", padding : "20", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between",marginBottom: 5 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text>   Allow notifications</Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 15 }}>
                            <Fontisto name="toggle-on" size={30} color="purple" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", height: "70", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" ,marginBottom: 5}}>
                        <View style={{ flexDirection: "row" }}>
                            <Text>       Allow location access</Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 35 }}>
                            <Fontisto name="toggle-on" size={30} color="purple" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Privacy