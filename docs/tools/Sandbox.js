import React from 'react';
import CodeSandboxer from 'react-codesandboxer';

export const Sandbox = ({ name, path, description, dependencies }) => (
  <CodeSandboxer
    name={name}
    pkgJSON={{
      name: name.split(' ').join('-'),
      version: '0.0.0',
      description,
      main: 'index.js',
      dependencies: {
        'react': 'latest',
        'reaviz': 'latest',
        'react-dom': 'latest',
        ...(dependencies || {})
      }
    }}
    examplePath={path}
    gitInfo={{
      account: 'jask-oss',
      repository: 'reaviz',
      host: 'github'
    }}
    autoDeploy={true}
    preload={true}
    skipRedirect={true}
  >
    {({ sandboxId, loading }) => (
      <div>
        {loading && !sandboxId ? null : (
          <iframe
            src={`https://codesandbox.io/embed/${sandboxId}?fontsize=14`}
            title="codesandboxer-example"
            allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
            style={{ width: '100%', height: '500px', border: 0, overflow: 'hidden' }}
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin">
          </iframe>
        )}
      </div>
    )}
  </CodeSandboxer>
);
