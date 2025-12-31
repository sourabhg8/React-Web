import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

/**
 * Portal component for rendering children outside the DOM hierarchy
 * Used for modals, tooltips, dropdowns, etc.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render in portal
 * @param {string} props.containerId - ID of the portal container element
 */
const Portal = ({ children, containerId = "portal-root" }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // Try to find existing container
    let portalContainer = document.getElementById(containerId);

    // If container doesn't exist, create it
    if (!portalContainer) {
      portalContainer = document.createElement("div");
      portalContainer.id = containerId;
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);

    // Cleanup: remove container if it was created by this component and is empty
    return () => {
      if (portalContainer && portalContainer.childNodes.length === 0) {
        // Only remove if empty to avoid removing containers used by other portals
        const existingContainer = document.getElementById(containerId);
        if (existingContainer && existingContainer.childNodes.length === 0) {
          // Don't remove the main portal-root, only cleanup custom ones
          if (containerId !== "portal-root") {
            document.body.removeChild(existingContainer);
          }
        }
      }
    };
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
};

export default Portal;
