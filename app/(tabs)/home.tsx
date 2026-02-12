import hymnsData from '@/assets/data/hymns.json';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSettings } from '../context/AppProvider';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { fontScale } = useAppSettings();
  const { playlist, removeFromPlaylist, clearPlaylist } = useAppSettings();
  const hymns = hymnsData as any[];

  
  const quickActions = [
    { title: 'Popular Hymns', icon: 'trending-up', route: '/(tabs)/explore?filter=popular' },
    { title: 'Recent Views', icon: 'time', route: '/(tabs)/explore?filter=recent' },
    { title: 'Favorites', icon: 'heart', route: '/(tabs)/favorites' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          {/* Header with decorative element */}
          <Animated.View 
            entering={FadeIn.duration(600)}
            style={styles.headerContainer}
          >
            <View style={[styles.decorativeCircle, { backgroundColor: `${colors.tint}20` }]} />
            <Ionicons 
              name="musical-notes" 
              size={40} 
              color={colors.tint} 
              style={styles.musicIcon}
            />
            <Text
              style={[
                styles.title,
                { 
                  color: colors.text, 
                  fontSize: 32 * fontScale,
                  marginTop: 12,
                },
              ]}
            >
              Welcome
            </Text>
            <Text
              style={[
                styles.subtitle,
                { 
                  color: colors.icon, 
                  fontSize: 18 * fontScale,
                  lineHeight: 24 * fontScale,
                },
              ]}
            >
              A sacred space for worship through hymns and spiritual songs.
            </Text>
          </Animated.View>
          

          {/* Quick Actions */}
          <Animated.View 
            entering={FadeInUp.duration(800).delay(600)}
            style={styles.actionsContainer}
          >
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 22 * fontScale }]}>
              Quick Actions
            </Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.actionButton, { backgroundColor: colorScheme === 'dark' || colorScheme === 'ocean' ? '#1F2937' : '#F9FAFB' }]}
                  onPress={() => router.push(action.route as any)}
                >
                  <Ionicons 
                    name={action.icon as any} 
                    size={24} 
                    color={colors.tint} 
                  />
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Today's Playlist */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(900)}
            style={styles.playlistContainer}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 22 * fontScale }]}>Today's PlayList</Text>
              <View style={{flexDirection: 'row', gap: 8}}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={[styles.actionText, { color: colors.tint }]}>Add songs</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearPlaylist}>
                  <Ionicons name="trash" size={20} color={colors.icon} />
                </TouchableOpacity>
              </View>
            </View>

            {playlist.length === 0 ? (
              <Text style={[{ color: colors.icon, marginTop: 8 }]}>No songs for today — add some from the hymn book.</Text>
            ) : (
              <View style={{ marginTop: 8, gap: 8 }}>
                {playlist.map((num) => {
                  const h = hymns.find((x) => x.number === num);
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[styles.playlistItem, { backgroundColor: colorScheme === 'dark' || colorScheme === 'ocean' ? '#111827' : '#FFF' }]}
                      activeOpacity={0.8}
                      onPress={() => router.push(`/hymn/${num}`)}
                    >
                      <Text style={{ color: colors.tint, fontWeight: '700', minWidth: 36 }}>{num}</Text>
                      <Text style={{ color: colors.text, flex: 1 }}>{h ? h.title : 'Unknown hymn'}</Text>
                      <TouchableOpacity onPress={() => removeFromPlaylist(num)}>
                        <Ionicons name="close" size={18} color={colors.icon} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Animated.View>

          {/* Main CTA */}
          <Animated.View 
            entering={FadeInUp.duration(800).delay(800)}
            style={styles.ctaContainer}
          >
            <TouchableOpacity
              style={[styles.mainButton, { backgroundColor: colors.tint }]}
              onPress={() => router.push('/(tabs)/explore')}
              activeOpacity={0.8}
            >
              <Ionicons name="library" size={24} color="white" />
              <Text style={styles.mainButtonText}>Open Hymn Book</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.tint }]}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.tint }]}>
                Or search for a specific hymn
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            entering={FadeInUp.duration(800).delay(1000)}
            style={styles.footer}
          >
            <Text style={[styles.footerText, { color: colors.icon }]}>
              "Let the word of Christ dwell in you richly" — Colossians 3:16
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  inner: { 
    flex: 1, 
    padding: 24, 
    gap: 32,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  decorativeCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'absolute',
    top: -50,
    opacity: 0.3,
  },
  musicIcon: {
    marginBottom: 8,
  },
  title: { 
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: { 
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
    maxWidth: '90%',
  },
  statsCard: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  featuresContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: width * 0.42,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  actionsContainer: {
    gap: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ctaContainer: {
    gap: 16,
    marginTop: 8,
  },
  mainButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.7,
  },
  playlistContainer: {
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)'
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
});
