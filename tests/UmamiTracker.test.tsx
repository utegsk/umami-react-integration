import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { UmamiTracker } from '../src/UmamiTracker';

beforeEach(() => {
  vi.resetModules();
  process.env.NODE_ENV = 'production';
  document.head.innerHTML = '';
});

afterEach(() => {
  cleanup();
  document.head.innerHTML = '';
  // restore so other test files start clean
  delete process.env.UMAMI_URL;
  delete process.env.UMAMI_ID;
});

function getInjectedScript() {
  return document.head.querySelector('script[data-website-id]') as HTMLScriptElement | null;
}

describe('UmamiTracker', () => {
  it('injects script.js by default', () => {
    render(<UmamiTracker websiteId="abc-123" url="https://umami.example.com" />);
    const script = getInjectedScript();
    expect(script).not.toBeNull();
    expect(script?.src).toBe('https://umami.example.com/script.js');
    expect(script?.getAttribute('data-website-id')).toBe('abc-123');
  });

  it('loads BOTH script.js and recorder.js when recorder={true}', () => {
    render(
      <UmamiTracker
        websiteId="abc-123"
        url="https://umami.example.com"
        recorder
      />,
    );
    const scripts = Array.from(
      document.head.querySelectorAll('script[data-website-id]'),
    ) as HTMLScriptElement[];
    const srcs = scripts.map((s) => s.src);
    expect(srcs).toContain('https://umami.example.com/script.js');
    expect(srcs).toContain('https://umami.example.com/recorder.js');
  });

  it('falls back to script.js when recorder={false}', () => {
    render(
      <UmamiTracker
        websiteId="abc-123"
        url="https://umami.example.com"
        recorder={false}
      />,
    );
    const script = getInjectedScript();
    expect(script?.src).toBe('https://umami.example.com/script.js');
  });

  it('passes through every supported data-* attribute', () => {
    render(
      <UmamiTracker
        websiteId="abc-123"
        url="https://umami.example.com"
        hostUrl="https://stats.example.com"
        domains={['blog.example.com', 'www.example.com']}
        doNotTrack
        excludeSearch
        excludeHash
        autoTrack={false}
        tag="experiment-a"
        trackPerformance
      />,
    );
    const script = getInjectedScript();
    expect(script?.getAttribute('data-host-url')).toBe('https://stats.example.com');
    expect(script?.getAttribute('data-domains')).toBe('blog.example.com,www.example.com');
    expect(script?.getAttribute('data-do-not-track')).toBe('true');
    expect(script?.getAttribute('data-exclude-search')).toBe('true');
    expect(script?.getAttribute('data-exclude-hash')).toBe('true');
    expect(script?.getAttribute('data-auto-track')).toBe('false');
    expect(script?.getAttribute('data-tag')).toBe('experiment-a');
    expect(script?.getAttribute('data-performance')).toBe('true');
  });

  it('omits data-* attributes when the corresponding prop is undefined', () => {
    render(<UmamiTracker websiteId="abc-123" url="https://umami.example.com" />);
    const script = getInjectedScript();
    expect(script?.hasAttribute('data-domains')).toBe(false);
    expect(script?.hasAttribute('data-do-not-track')).toBe(false);
    expect(script?.hasAttribute('data-tag')).toBe(false);
  });

  it('merges custom scriptAttributes on top of named props', () => {
    render(
      <UmamiTracker
        websiteId="abc-123"
        url="https://umami.example.com"
        scriptAttributes={{ 'data-before-send': 'myHandler' }}
      />,
    );
    const script = getInjectedScript();
    expect(script?.getAttribute('data-before-send')).toBe('myHandler');
  });

  it('does not double-inject when re-rendered', () => {
    const { rerender } = render(<UmamiTracker websiteId="abc-123" url="https://umami.example.com" />);
    rerender(<UmamiTracker websiteId="abc-123" url="https://umami.example.com" />);
    rerender(<UmamiTracker websiteId="abc-123" url="https://umami.example.com" />);
    const scripts = document.head.querySelectorAll('script[data-website-id]');
    expect(scripts).toHaveLength(1);
  });

  it('does not inject in development when onlyInProduction is true (default)', () => {
    process.env.NODE_ENV = 'development';
    render(<UmamiTracker websiteId="abc-123" url="https://umami.example.com" />);
    expect(getInjectedScript()).toBeNull();
  });

  it('injects in development when onlyInProduction={false}', () => {
    process.env.NODE_ENV = 'development';
    render(
      <UmamiTracker
        websiteId="abc-123"
        url="https://umami.example.com"
        onlyInProduction={false}
      />,
    );
    expect(getInjectedScript()).not.toBeNull();
  });

  it('defers injection until first user interaction when lazyLoad={true}', () => {
    render(
      <UmamiTracker
        websiteId="abc-123"
        url="https://umami.example.com"
        lazyLoad
      />,
    );
    expect(getInjectedScript()).toBeNull();

    act(() => {
      window.dispatchEvent(new Event('pointerdown'));
    });
    expect(getInjectedScript()).not.toBeNull();
  });

  it('strips trailing slashes from url', () => {
    render(<UmamiTracker websiteId="abc-123" url="https://umami.example.com/" />);
    const script = getInjectedScript();
    expect(script?.src).toBe('https://umami.example.com/script.js');
  });

  it('falls back to UMAMI_URL env when url prop is omitted', () => {
    process.env.UMAMI_URL = 'https://env.example.com';
    render(<UmamiTracker websiteId="abc-123" />);
    const script = getInjectedScript();
    expect(script?.src).toBe('https://env.example.com/script.js');
  });

  it('falls back to UMAMI_ID env when websiteId prop is omitted', () => {
    process.env.UMAMI_ID = 'env-id-456';
    // @ts-expect-error — testing the env-var fallback path; websiteId is required by the type
    render(<UmamiTracker url="https://umami.example.com" />);
    const script = getInjectedScript();
    expect(script?.getAttribute('data-website-id')).toBe('env-id-456');
  });
});
