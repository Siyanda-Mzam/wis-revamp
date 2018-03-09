import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { mapMarkerActions } from './mapMarker.reducer';
import MapMarker from './mapMarker.view';

const mapStateToProps = ({ mapReducer }) => ({
  ...mapReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...mapMarkerActions
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MapMarker);
