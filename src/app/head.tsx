export default function Head() {
  return (
    <>
      {/* Use the Scale icon SVG as the site favicon */}
      <link rel="icon" type="image/svg+xml" href="/scale.svg" sizes="any" />
      {/* Provide fallback to default .ico for older browsers */}
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  );
}
