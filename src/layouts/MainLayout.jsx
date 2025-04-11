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
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  SupervisorAccount as SupervisorIcon
} from '@mui/icons-material';
import { logout } from '../redux/slices/authSlice';

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
          { text: 'New Leave Request', icon: <EventNoteIcon />, path: '/student/leave/new' },
          { text: 'My Leave Requests', icon: <EventNoteIcon />, path: '/student/leave/requests' }
        ];
      case 'advisor':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/advisor/dashboard' },
          { text: 'Leave Requests', icon: <EventNoteIcon />, path: '/advisor/leave/requests' },
          { text: 'Manage Students', icon: <PeopleIcon />, path: '/advisor/students' }
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
    <div>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div">
          INFO Institute
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Attendance Management Portal
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
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
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              // Navigate to profile page when implemented
            }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              handleLogout();
            }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
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
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar /> {/* This empty Toolbar provides spacing below the AppBar */}
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;