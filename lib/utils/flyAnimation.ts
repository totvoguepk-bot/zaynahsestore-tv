export function animateFlyTo(
  sourceElement: HTMLElement,
  targetId: string,
  itemImage?: string
) {
  if (typeof window === 'undefined') return;

  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  // 1. Get positions
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const sourceX = sourceRect.left + sourceRect.width / 2 - 19;
  const sourceY = sourceRect.top + sourceRect.height / 2 - 19;
  const targetX = targetRect.left + targetRect.width / 2 - 19;
  const targetY = targetRect.top + targetRect.height / 2 - 19;

  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;

  // 2. Create outer wrapper for X-axis (linear horizontal movement)
  const outer = document.createElement('div');
  outer.style.position = 'fixed';
  outer.style.top = `${sourceY}px`;
  outer.style.left = `${sourceX}px`;
  outer.style.width = '38px';
  outer.style.height = '38px';
  outer.style.zIndex = '999999'; // Ensure it's on top of modals (which are z-50 or z-[200])
  outer.style.pointerEvents = 'none';
  outer.style.transition = 'transform 0.8s linear, opacity 0.8s ease-out';
  outer.style.transform = 'translate3d(0, 0, 0)';
  outer.style.opacity = '1';

  // 3. Create inner element for Y-axis (curved vertical movement) and visual styling
  const inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '100%';
  inner.style.borderRadius = '50%';
  inner.style.display = 'flex';
  inner.style.alignItems = 'center';
  inner.style.justifyContent = 'center';
  inner.style.background = 'var(--primary, #1a1a2e)';
  inner.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.15)';
  inner.style.border = '2px solid white';
  // Use a custom cubic-bezier for vertical path to create a pleasant arc
  inner.style.transition = 'transform 0.8s cubic-bezier(0.06, 0.97, 0.44, 1.2)';
  inner.style.transform = 'translate3d(0, 0, 0) scale(1)';

  if (itemImage) {
    const img = document.createElement('img');
    img.src = itemImage;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    inner.appendChild(img);
  } else {
    // Fallback simple "+1" badge
    inner.innerHTML = `<span style="color: white; font-size: 9px; font-weight: 900;">+1</span>`;
  }

  outer.appendChild(inner);
  document.body.appendChild(outer);

  // Force reflow
  outer.getBoundingClientRect();

  // 4. Trigger the transitions to target
  outer.style.transform = `translate3d(${deltaX}px, 0, 0)`;
  outer.style.opacity = '0.15';
  inner.style.transform = `translate3d(0, ${deltaY}px, 0) scale(0.15)`;

  const cleanup = () => {
    if (outer.parentNode) {
      outer.remove();
    }
    // Add bounce to target icon
    targetElement.classList.add('animate-bounce-bounce');
    setTimeout(() => {
      targetElement.classList.remove('animate-bounce-bounce');
    }, 450);
  };

  outer.addEventListener('transitionend', (e) => {
    if (e.target === outer) {
      cleanup();
    }
  });

  // Fallback cleanup if event does not fire (e.g. background tab)
  setTimeout(() => {
    if (outer.parentNode) {
      cleanup();
    }
  }, 750);
}
