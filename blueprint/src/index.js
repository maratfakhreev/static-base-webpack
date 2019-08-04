const requireAll = requireContext => requireContext.keys().forEach(requireContext);

requireAll(require.context('stylesheets', false, /\.css$/));
requireAll(require.context('scripts', false, /\.js/));
