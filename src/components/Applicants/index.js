import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from 'material-table';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  OpenInNew,
} from '@material-ui/icons';
import { compose } from 'recompose';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { getAllUsers } from '../../providers/actions/Users';
import { history } from '../../history';

import ApplicantDetailsModal from './ApplicantDetailsModal';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const columns = [
  { title: 'Name', field: 'name' },
  { title: 'Age', field: 'age' },
  { title: 'Email', field: 'email' },
];

function Applicants(props) {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [userObj, setUserObj] = useState();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  const { allUsers, isLoading } = useSelector((state) => ({
    allUsers: state.usersReducer.allUsers,
    isLoading: state.userReducer.isLoading,
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  return (
    <div>
      <Helmet>
        <title>Patients</title>
      </Helmet>
      <MaterialTable
        title="Patients List"
        icons={tableIcons}
        columns={columns}
        data={users}
        actions={[
          {
            icon: OpenInNew,
            tooltip: 'View',
            onClick: (event, rowData) => {
              history.push({
                pathname: ROUTES.MAP_SCREEN,
                search: `?patientUuid=${rowData.uuid}`,
              });
              window.location.reload(false);
              // setUserObj(rowData);
              // handleOpen();
            },
          },
        ]}
      />
      {open && (
        <ApplicantDetailsModal
          userData={userObj}
          isOpen={open}
          toClose={handleClose}
          status={status}
          onStatusChange={setStatus}
        />
      )}
    </div>
  );
}

export default Applicants;
