import 'package:flutter/foundation.dart';
import 'widget_service_stub.dart' if (dart.library.io) 'widget_service_native.dart' if (dart.library.html) 'widget_service_web.dart';

// No code needed in the entry file as it only serves as a conditional hub.
// Actually, I'll export the classes.

export 'widget_service_stub.dart' if (dart.library.io) 'widget_service_native.dart' if (dart.library.html) 'widget_service_web.dart';
