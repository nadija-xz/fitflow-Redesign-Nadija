import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },


  grow: {
    flex: 1,
  },


  pressed: {
    opacity: 0.8,
  },


  /* =====================================================
     HEADER
  ====================================================== */

  header: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',

    paddingHorizontal: 20,

    paddingTop: 8,

    paddingBottom: 14,
  },


  brandContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 9,
  },


  brandIcon: {
    width: 42,

    height: 42,

    borderRadius: 12,
  },


  brand: {
    fontSize: 27,

    fontWeight: '900',

    letterSpacing: -1.3,
  },


  brandDark: {
    color: '#064E3B',
  },


  brandGreen: {
    color: '#079455',
  },


  avatar: {
    width: 43,

    height: 43,

    borderRadius: 22,

    backgroundColor:
      '#E7F8ED',

    borderWidth: 2,

    borderColor: '#D1FADF',

    alignItems: 'center',

    justifyContent: 'center',
  },


  avatarText: {
    color: '#067647',

    fontWeight: '900',

    fontSize: 18,
  },


  /* =====================================================
     CONTENT
  ====================================================== */

  content: {
    paddingHorizontal: 20,

    paddingTop: 4,

    paddingBottom: 125,
  },


  greetingRow: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',
  },


  greeting: {
    fontSize: 24,

    fontWeight: '900',

    color: '#101828',

    letterSpacing: -0.7,

    marginBottom: 3,
  },


  pageTitle: {
    fontSize: 26,

    fontWeight: '900',

    color: '#101828',

    letterSpacing: -0.8,
  },


  muted: {
    fontSize: 14,

    color: '#667085',

    lineHeight: 21,
  },


  mutedCenter: {
    fontSize: 13,

    color: '#667085',

    lineHeight: 20,

    textAlign: 'center',

    marginTop: 6,
  },


  small: {
    fontSize: 12,

    color: '#667085',

    lineHeight: 18,

    marginTop: 3,
  },


  /* =====================================================
     HERO
  ====================================================== */

  hero: {
    position: 'relative',

    overflow: 'hidden',

    backgroundColor: '#079455',

    borderRadius: 20,

    padding: 18,

    marginTop: 20,

    shadowColor: '#079455',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.22,

    shadowRadius: 14,

    elevation: 5,
  },


  heroCircleOne: {
    position: 'absolute',

    width: 130,

    height: 130,

    borderRadius: 65,

    backgroundColor:
      '#FFFFFF0D',

    right: -35,

    top: -45,
  },


  heroCircleTwo: {
    position: 'absolute',

    width: 95,

    height: 95,

    borderRadius: 48,

    backgroundColor:
      '#FFFFFF0A',

    right: 50,

    bottom: -50,
  },


  heroRow: {
    flexDirection: 'row',

    gap: 12,

    alignItems: 'center',
  },


  aiBadge: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,
  },


  heroLabel: {
    fontSize: 11,

    fontWeight: '800',

    color: '#FFFFFF',

    letterSpacing: 0.8,
  },


  heroTitle: {
    fontSize: 23,

    lineHeight: 29,

    fontWeight: '900',

    color: '#FFFFFF',

    marginTop: 10,
  },


  heroDescription: {
    maxWidth: 200,

    fontSize: 13,

    lineHeight: 19,

    color: '#E9FFF2',

    marginTop: 6,
  },


  heroIcon: {
    width: 68,

    height: 68,

    borderRadius: 34,

    backgroundColor:
      '#FFFFFF20',

    alignItems: 'center',

    justifyContent: 'center',

    transform: [
      {
        rotate: '-20deg',
      },
    ],
  },


  start: {
    backgroundColor: '#FFFFFF',

    borderRadius: 12,

    minHeight: 48,

    marginTop: 19,

    flexDirection: 'row',

    gap: 7,

    alignItems: 'center',

    justifyContent: 'center',
  },


  startText: {
    color: '#067647',

    fontSize: 13,

    fontWeight: '900',
  },


  /* =====================================================
     DOTS
  ====================================================== */

  dots: {
    flexDirection: 'row',

    justifyContent: 'center',

    gap: 6,

    marginVertical: 15,
  },


  dot: {
    width: 7,

    height: 7,

    backgroundColor:
      '#D0D5DD',

    borderRadius: 4,
  },


  dotActive: {
    width: 20,

    height: 7,

    backgroundColor:
      '#079455',

    borderRadius: 4,
  },


  /* =====================================================
     STATS
  ====================================================== */

  stats: {
    flexDirection: 'row',

    gap: 10,
  },


  stat: {
    flex: 1,

    backgroundColor:
      '#F7F9F8',

    borderWidth: 1,

    borderColor: '#EEF2F0',

    borderRadius: 15,

    paddingVertical: 13,

    alignItems: 'center',
  },


  statIcon: {
    width: 29,

    height: 29,

    borderRadius: 10,

    backgroundColor:
      '#E7F8ED',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 6,
  },


  statLabel: {
    fontSize: 11,

    color: '#667085',
  },


  statValue: {
    fontSize: 18,

    fontWeight: '900',

    color: '#101828',

    marginTop: 4,
  },


  /* =====================================================
     QUICK ACTIONS
  ====================================================== */

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',

    marginTop: 24,

    marginBottom: 11,
  },


  section: {
    fontSize: 18,

    fontWeight: '800',

    color: '#101828',
  },


  sectionLink: {
    color: '#079455',

    fontSize: 12,

    fontWeight: '700',
  },


  action: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    minHeight: 63,

    paddingHorizontal: 12,

    paddingVertical: 9,

    backgroundColor:
      '#F8FAF9',

    borderWidth: 1,

    borderColor: '#EEF2F0',

    borderRadius: 14,

    marginBottom: 10,
  },


  actionIcon: {
    width: 39,

    height: 39,

    backgroundColor:
      '#079455',

    borderRadius: 11,

    justifyContent: 'center',

    alignItems: 'center',
  },


  chevronCircle: {
    width: 31,

    height: 31,

    borderRadius: 10,

    backgroundColor:
      '#FFFFFF',

    alignItems: 'center',

    justifyContent: 'center',
  },


  rowTitle: {
    color: '#101828',

    fontSize: 14,

    fontWeight: '700',
  },


  /* =====================================================
     GOAL
  ====================================================== */

  focus: {
    flexDirection: 'row',

    gap: 13,

    padding: 15,

    marginTop: 12,

    backgroundColor:
      '#F6FEF9',

    borderWidth: 1,

    borderColor:
      '#D1FADF',

    borderRadius: 16,
  },


  focusIcon: {
    width: 42,

    height: 42,

    borderRadius: 13,

    backgroundColor:
      '#DDF8E7',

    alignItems: 'center',

    justifyContent: 'center',
  },


  focusLabel: {
    color: '#079455',

    fontSize: 10,

    fontWeight: '900',

    letterSpacing: 0.7,
  },


  focusTitle: {
    color: '#101828',

    fontSize: 15,

    fontWeight: '800',

    marginTop: 3,
  },


  /* =====================================================
     WORKOUTS
  ====================================================== */

  workout: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    padding: 13,

    backgroundColor:
      '#F8FAF9',

    borderWidth: 1,

    borderColor:
      '#EEF2F0',

    borderRadius: 14,

    marginBottom: 10,
  },


  workoutIcon: {
    width: 42,

    height: 42,

    borderRadius: 13,

    backgroundColor:
      '#E7F8ED',

    alignItems: 'center',

    justifyContent: 'center',
  },


  empty: {
    alignItems: 'center',

    paddingVertical: 35,

    paddingHorizontal: 20,
  },


  emptyTitle: {
    color: '#101828',

    fontSize: 15,

    fontWeight: '800',

    marginTop: 10,
  },


  retry: {
    marginTop: 12,

    minHeight: 42,

    paddingHorizontal: 20,

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor:
      '#E7F8ED',
  },


  greenText: {
    color: '#067647',

    fontSize: 13,

    fontWeight: '800',
  },


  /* =====================================================
     PROGRESS
  ====================================================== */

  profileDetails: {
    marginTop: 25,

    backgroundColor:
      '#F8FAF9',

    borderRadius: 16,

    paddingHorizontal: 16,
  },


  detailRow: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    gap: 15,

    paddingVertical: 18,

    borderBottomWidth: 1,

    borderBottomColor:
      '#EAECF0',
  },


  /* =====================================================
     NEW NAVIGATION
  ====================================================== */

  navWrapper: {
    position: 'absolute',

    left: 14,

    right: 14,

    bottom: 8,

    backgroundColor:
      '#FFFFFF',

    borderRadius: 24,

    shadowColor: '#101828',

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.13,

    shadowRadius: 18,

    elevation: 12,
  },


  nav: {
    minHeight: 76,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 7,

    paddingVertical: 7,

    borderRadius: 24,

    borderWidth: 1,

    borderColor:
      '#EEF2F0',

    backgroundColor:
      '#FFFFFF',
  },


  navItem: {
    flex: 1,

    minHeight: 62,

    alignItems: 'center',

    justifyContent: 'center',

    gap: 3,

    borderRadius: 17,

    position: 'relative',
  },


  navItemActive: {
    borderRadius: 17,
    backgroundColor:
      '#F2FBF5',
  },


  navPressed: {
    opacity: 0.75,
  },


  navIconContainer: {
    width: 34,

    height: 34,

    borderRadius: 12,

    alignItems: 'center',

    justifyContent: 'center',
  },


  navIconActive: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor:
      '#079455',

    shadowColor: '#079455',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 7,

    elevation: 3,
  },


  navLabel: {
    fontSize: 9.5,

    fontWeight: '600',

    color: '#98A2B3',
  },


  navLabelActive: {
    color: '#079455',

    fontWeight: '800',
  },


  navDisabled: {
    color: '#C5C9D0',
  },


  soonBadge: {
    position: 'absolute',

    top: 3,

    right: 1,

    paddingHorizontal: 4,

    paddingVertical: 1,

    borderRadius: 5,

    backgroundColor:
      '#F2F4F7',
  },


  soonText: {
    fontSize: 6,

    fontWeight: '800',

    color: '#98A2B3',
  },


  /* =====================================================
     MODAL
  ====================================================== */

  overlay: {
    flex: 1,

    backgroundColor:
      '#10182866',

    justifyContent:
      'flex-end',
  },


  sheet: {
    backgroundColor:
      '#FFFFFF',

    borderTopLeftRadius: 28,

    borderTopRightRadius: 28,

    paddingHorizontal: 25,

    paddingTop: 12,

    paddingBottom: 45,
  },


  sheetHandle: {
    width: 44,

    height: 5,

    borderRadius: 3,

    backgroundColor:
      '#D0D5DD',

    alignSelf: 'center',

    marginBottom: 5,
  },


  close: {
    alignSelf: 'flex-end',

    width: 42,

    height: 42,

    alignItems: 'center',

    justifyContent: 'center',
  },


  profileAvatar: {
    width: 68,

    height: 68,

    borderRadius: 34,

    alignSelf: 'center',

    backgroundColor:
      '#E7F8ED',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 11,
  },


  profileAvatarText: {
    color: '#079455',

    fontSize: 28,

    fontWeight: '900',
  },


  modalWorkoutIcon: {
    width: 62,

    height: 62,

    borderRadius: 20,

    alignSelf: 'center',

    backgroundColor:
      '#E7F8ED',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 12,
  },


  modalTitle: {
    color: '#101828',

    textAlign: 'center',

    fontSize: 22,

    fontWeight: '900',
  },


  modalEmail: {
    color: '#667085',

    textAlign: 'center',

    fontSize: 13,

    marginTop: 5,
  },


  modalDescription: {
    color: '#667085',

    textAlign: 'center',

    fontSize: 14,

    lineHeight: 21,

    marginTop: 20,
  },


  profileSummary: {
    padding: 15,

    backgroundColor:
      '#F6FEF9',

    borderRadius: 15,

    marginTop: 22,

    gap: 5,
  },


  logout: {
    minHeight: 52,

    borderRadius: 13,

    backgroundColor:
      '#FEF3F2',

    flexDirection: 'row',

    gap: 8,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 18,
  },


  logoutText: {
    color: '#D92D20',

    fontSize: 14,

    fontWeight: '800',
  },

});