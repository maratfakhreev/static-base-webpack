function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('views', false, /\.pug$/));
requireAll(require.context('stylesheets', false, /\.css$/));
requireAll(require.context('scripts', false, /\.js/));
