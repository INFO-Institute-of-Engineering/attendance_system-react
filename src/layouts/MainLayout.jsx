import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Container,
  Badge,
  InputBase
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  SupervisorAccount as SupervisorIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { logout } from '../redux/slices/authSlice';
import InfoLogo from '../assets/info-logo.svg';

const drawerWidth = 240;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    switch (role) {
      case 'student':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
          { text: 'Attendance', icon: <EventNoteIcon />, path: '/student/attendance' },
          { text: 'Leave Request', icon: <EventNoteIcon />, path: '/student/leave/new' },
          { text: 'OD Request', icon: <EventNoteIcon />, path: '/student/od/new' },
          { text: 'Half-Day Request', icon: <EventNoteIcon />, path: '/student/halfday/new' },
          { text: 'Status', icon: <EventNoteIcon />, path: '/student/status' }
        ];
      case 'advisor':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/advisor/dashboard' },
          { text: 'Leave Requests', icon: <EventNoteIcon />, path: '/advisor/leave/requests' },
          { text: 'Manage Students', icon: <PeopleIcon />, path: '/advisor/students' },
          { text: 'Timetable', icon: <EventNoteIcon />, path: '/advisor/timetable' }
        ];
      case 'hod':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/hod/dashboard' },
          { text: 'Leave Requests', icon: <EventNoteIcon />, path: '/hod/leave/requests' },
          { text: 'Manage Staff', icon: <SupervisorIcon />, path: '/hod/staff' },
          { text: 'Manage Students', icon: <PeopleIcon />, path: '/hod/students' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <Box className="modern-sidebar" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Institute Name */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: { xs: 1, sm: 2 } }}>
        <Box 
          component="img"
          src={InfoLogo}
          alt="INFO Institute Logo"
          sx={{ 
            width: { xs: 32, sm: 40 }, 
            height: { xs: 32, sm: 40 }, 
            mr: 1,
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            animation: 'pulse 3s infinite'
          }}
        />
        <Typography variant="h6" component="div" className="gradient-text" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
          INFO Institute of<br />Engineering
        </Typography>
      </Box>
      
      {/* User Profile Section */}
      <Box 
        className="glass-card"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          p: { xs: 1.5, sm: 2 },
          mx: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3 },
          borderRadius: '16px'
        }}
      >
        <Avatar 
          sx={{ 
            width: { xs: 60, sm: 80 }, 
            height: { xs: 60, sm: 80 }, 
            mb: 1,
            border: '2px solid rgba(255,255,255,0.3)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)'
          }}
        >
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8, mb: 1 }}>
          {user?.rollNumber || '22E-5045'}
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2, mb: 2 }} />
      
      {/* Navigation Items */}
      <List sx={{ px: { xs: 0.5, sm: 1 }, flex: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              className={location.pathname === item.path ? 'glow-border' : ''}
              sx={{
                borderRadius: '12px',
                py: { xs: 1, sm: 1.2 },
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  transform: 'translateX(5px)'
                }
              }}
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white', 
                minWidth: { xs: 36, sm: 40 },
                opacity: location.pathname === item.path ? 1 : 0.7
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: location.pathname === item.path ? 'medium' : 'normal',
                  letterSpacing: '0.5px'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: { xs: 1.5, sm: 2 }, mt: 'auto' }}>
        <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', textAlign: 'center' }}>
          © INFO Institute of Engineering
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }} className="dashboard-bg">
      {/* Decorative floating circles - hidden on very small screens via CSS */}
      <Box className="decorative-circle circle-1"></Box>
      <Box className="decorative-circle circle-2"></Box>
      <Box className="decorative-circle circle-3"></Box>
      
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: { xs: 'auto', sm: 'auto' }
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' }, px: { xs: 1, sm: 2 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'medium', fontSize: { sm: '1.1rem', md: '1.25rem' } }}>
            Attendance Management Portal
          </Typography>
          
          {/* Search Box */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center',
            ml: { xs: 1, sm: 2 }
          }}>
            <Box 
              className="glass"
              sx={{
                position: 'relative',
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 0 15px rgba(138, 43, 226, 0.3)'
                },
                width: { xs: '100%', sm: '50%' },
                maxWidth: '400px',
                transition: 'all 0.3s ease'
              }}
            >
              <Box sx={{ 
                padding: '0 16px', 
                height: '100%', 
                position: 'absolute', 
                display: 'flex', 
                alignItems: 'center'
              }}>
                <SearchIcon sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  animation: 'pulse 3s infinite'
                }} />
              </Box>
              <InputBase
                placeholder="Search…"
                sx={{
                  color: 'white',
                  padding: { xs: '8px 8px 8px 40px', sm: '10px 8px 10px 48px' },
                  width: '100%',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '& ::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1
                  }
                }}
              />
            </Box>
          </Box>
          
          {/* Notification Icon */}
          <IconButton 
            color="inherit" 
            className="notification-badge"
            sx={{ 
              mr: { xs: 0.5, sm: 1 },
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              transition: 'all 0.3s ease',
              padding: { xs: 0.5, sm: 0.75 }
            }}
          >
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
            </Badge>
          </IconButton>
          
          {/* User Profile */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            className="glow-border"
            sx={{
              p: 0.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <Avatar sx={{ 
              width: { xs: 28, sm: 32 }, 
              height: { xs: 28, sm: 32 },
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 10px rgba(138, 43, 226, 0.4)'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                backgroundColor: 'rgba(106, 13, 173, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                '& .MuiMenuItem-root': {
                  borderRadius: '8px',
                  mx: 0.5,
                  my: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(5px)'
                  }
                }
              }
            }}
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              // Navigate to profile page when implemented
            }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              handleLogout();
            }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: '5px 0 25px rgba(0, 0, 0, 0.2)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: '5px 0 25px rgba(0, 0, 0, 0.2)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.3s ease',
          overflowX: 'hidden'
        }}
      >
        <Toolbar />
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: { xs: 1, sm: 2 },
            position: 'relative',
            zIndex: 2,
            px: { xs: 1, sm: 2 }
          }}
        >
          {/* Floating decorative elements */}
          <Box 
            className="floating-card"
            sx={{ 
              position: 'absolute', 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(157, 78, 221, 0.1) 0%, rgba(255, 110, 199, 0.05) 70%)',
              top: '-50px',
              right: '-100px',
              zIndex: -1,
              filter: 'blur(2px)'
            }}
          />
          <Box 
            className="floating-card"
            sx={{ 
              position: 'absolute', 
              width: '150px', 
              height: '150px', 
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              background: 'radial-gradient(circle, rgba(255, 110, 199, 0.1) 0%, rgba(157, 78, 221, 0.05) 70%)',
              bottom: '10%',
              left: '5%',
              zIndex: -1,
              filter: 'blur(2px)',
              animationDelay: '2s'
            }}
          />
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;