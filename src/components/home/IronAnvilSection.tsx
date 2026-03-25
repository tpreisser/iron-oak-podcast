'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@/hooks/useGSAP';

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
  brightness: number;
}

// ============================================================
// ANVIL DRAWING — anatomically correct London pattern anvil
//
// Coordinate system: cx/cy = center-x of anvil body, cy = top of face plate
//
// Key anatomy (all values relative to scale=1):
//   Horn   — long conical taper pointing LEFT, same length as face, rounds to blunt tip
//   Face   — hardened flat steel top surface, widest part, slightly raised plate
//   Heel   — square rear extension RIGHT of face, has hardy hole + pritchel hole
//   Throat — dramatically waisted/narrowed body below face (most iconic feature)
//   Base   — two broad feet flanges with recessed arch; significantly wider than throat
// ============================================================
function drawAnvil(
  ctx: CanvasRenderingContext2D,
  cx: number,   // horizontal center of the anvil body
  cy: number,   // y-coordinate of the TOP of the face plate
  scale: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // ---- Core dimension constants ----
  // These are tuned so the anvil reads correctly at canvas scale.
  // Adjust scale argument at call site to resize; keep ratios here intact.
  const faceW       = 190;  // width of the flat top working face
  const faceH       = 18;   // thickness of the face plate (the hardened steel slab)
  const hornLen     = 170;  // how far the horn extends left of face left edge
  const hornBaseH   = 18;   // horn height at its root (matches faceH)
  const hornTipH    = 6;    // horn height at tip (blunt point)
  const heelW       = 42;   // heel extends this far right of face right edge

  // Hardy hole (square) and pritchel hole (round) sit on the heel
  const hardySize   = 14;   // side length of the square hardy hole
  const pritchRad   = 5;    // radius of the round pritchel hole

  // Throat / waist — the narrow section below the face plate
  // Top of throat is just below face plate; bottom expands to base
  const throatTopHW = 68;   // half-width at top of throat (right below face)
  const throatMidHW = 42;   // half-width at narrowest waist point
  const throatH     = 70;   // height of the throat section

  // Base — broad feet at the bottom
  const baseHW      = 130;  // half-width of the base block
  const baseFeetHW  = 160;  // half-width at the outermost feet flanges
  const baseH       = 48;   // total height of the base block
  const feetH       = 14;   // height of the flange overhang on each foot
  const archW       = 100;  // width of the arch cutout between feet (each side)

  // ---- Vertical reference lines (measured downward from cy=0 = top of face) ----
  const faceTop     = 0;
  const faceBot     = faceH;           // bottom of face plate = top of throat
  const throatBot   = faceBot + throatH; // bottom of throat = top of base
  const baseBot     = throatBot + baseH; // ground level

  // ============================================================
  // SHADOW beneath anvil (ground shadow ellipse)
  // ============================================================
  {
    const shadowG = ctx.createRadialGradient(0, baseBot + 8, 8, 0, baseBot + 8, baseFeetHW + 20);
    shadowG.addColorStop(0, 'rgba(0,0,0,0.50)');
    shadowG.addColorStop(0.4, 'rgba(0,0,0,0.20)');
    shadowG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowG;
    ctx.beginPath();
    ctx.ellipse(0, baseBot + 10, baseFeetHW + 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ============================================================
  // BASE — Two feet with a recessed arch between them
  //
  // Profile (viewed from front):
  //   Left foot block | arch gap | Right foot block
  //   The arch is a curved cutout that lifts the center off the ground
  // ============================================================
  {
    // Main base rectangle (full width, bottom portion)
    const baseGradH = ctx.createLinearGradient(-baseHW, 0, baseHW, 0);
    baseGradH.addColorStop(0,    '#1C1C20');
    baseGradH.addColorStop(0.08, '#2E2E34');
    baseGradH.addColorStop(0.25, '#3C3C44');
    baseGradH.addColorStop(0.50, '#484852');
    baseGradH.addColorStop(0.75, '#3A3A42');
    baseGradH.addColorStop(0.92, '#2A2A30');
    baseGradH.addColorStop(1,    '#1A1A1E');

    // Draw base as a path with feet flanges on each side
    ctx.beginPath();
    // Start at bottom-left of left foot
    ctx.moveTo(-baseFeetHW, baseBot);
    ctx.lineTo(-baseFeetHW, throatBot + (baseH - feetH));        // left foot outer side
    ctx.lineTo(-baseHW,     throatBot + (baseH - feetH));        // left foot inner step
    ctx.lineTo(-baseHW,     throatBot);                          // left side of main base top
    ctx.lineTo( baseHW,     throatBot);                          // right side of main base top
    ctx.lineTo( baseHW,     throatBot + (baseH - feetH));        // right foot inner step
    ctx.lineTo( baseFeetHW, throatBot + (baseH - feetH));        // right foot outer side
    ctx.lineTo( baseFeetHW, baseBot);                            // bottom-right of right foot
    ctx.closePath();
    ctx.fillStyle = baseGradH;
    ctx.fill();

    // Arch cutout between the two feet (the gap under the base)
    // This creates the classic anvil base silhouette
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    const archLeft  = -archW;
    const archRight =  archW;
    const archTop   = throatBot + (baseH - feetH) + 2; // just below the step
    const archDepth = feetH - 4;                        // how deep the arch goes
    ctx.moveTo(archLeft,  baseBot);
    ctx.lineTo(archLeft,  archTop + archDepth * 0.3);
    ctx.bezierCurveTo(
      archLeft,  archTop,
      -archW * 0.5, archTop - archDepth * 0.5,
      0, archTop - archDepth * 0.6,
    );
    ctx.bezierCurveTo(
      archW * 0.5, archTop - archDepth * 0.5,
      archRight, archTop,
      archRight, archTop + archDepth * 0.3,
    );
    ctx.lineTo(archRight, baseBot);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Top edge highlight of base
    ctx.beginPath();
    ctx.moveTo(-baseHW, throatBot);
    ctx.lineTo( baseHW, throatBot);
    ctx.strokeStyle = 'rgba(90,90,100,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Feet top edge highlight
    ctx.beginPath();
    ctx.moveTo(-baseFeetHW, throatBot + (baseH - feetH));
    ctx.lineTo(-baseHW,     throatBot + (baseH - feetH));
    ctx.moveTo( baseHW,     throatBot + (baseH - feetH));
    ctx.lineTo( baseFeetHW, throatBot + (baseH - feetH));
    ctx.strokeStyle = 'rgba(70,70,80,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ============================================================
  // THROAT / WAIST — the dramatic hourglass narrowing below face
  //
  // Left side: bezier curve that sweeps INWARD then back out
  // Right side: mirror of left
  //
  // This is the most visually distinctive part of a London-pattern anvil.
  // The curves are pronounced — not gentle. The waist is very narrow.
  // ============================================================
  {
    const throatGrad = ctx.createLinearGradient(-throatTopHW - 20, 0, throatTopHW + 20, 0);
    throatGrad.addColorStop(0,    '#181820');
    throatGrad.addColorStop(0.12, '#28282E');
    throatGrad.addColorStop(0.30, '#363640');
    throatGrad.addColorStop(0.50, '#42424C');
    throatGrad.addColorStop(0.70, '#363640');
    throatGrad.addColorStop(0.88, '#26262C');
    throatGrad.addColorStop(1,    '#161618');

    ctx.beginPath();
    // Top-left of throat (just below left edge of face plate)
    ctx.moveTo(-throatTopHW, faceBot);

    // LEFT side curve: sweeps dramatically inward to the waist, then back out to base
    // Control point 1: pull sharply inward near the top
    // Control point 2: flare out gently near the base
    ctx.bezierCurveTo(
      -throatTopHW,          faceBot + throatH * 0.25,  // CP1: stay wide briefly
      -throatMidHW,          faceBot + throatH * 0.55,  // CP2: pulled hard inward at mid
      -baseHW,               throatBot,                 // arrives at base width
    );

    // Bottom of throat (base top edge)
    ctx.lineTo(baseHW, throatBot);

    // RIGHT side curve: mirror of left
    ctx.bezierCurveTo(
      throatMidHW,           faceBot + throatH * 0.55,
      throatTopHW,           faceBot + throatH * 0.25,
      throatTopHW,           faceBot,
    );

    ctx.closePath();
    ctx.fillStyle = throatGrad;
    ctx.fill();

    // LEFT side edge (thin highlight on the curve)
    ctx.beginPath();
    ctx.moveTo(-throatTopHW, faceBot);
    ctx.bezierCurveTo(
      -throatTopHW,  faceBot + throatH * 0.25,
      -throatMidHW,  faceBot + throatH * 0.55,
      -baseHW,       throatBot,
    );
    ctx.strokeStyle = 'rgba(55,55,65,0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // RIGHT side edge
    ctx.beginPath();
    ctx.moveTo(throatTopHW, faceBot);
    ctx.bezierCurveTo(
      throatMidHW,  faceBot + throatH * 0.25,
      throatTopHW,  faceBot + throatH * 0.55,
      baseHW,       throatBot,
    );
    ctx.stroke();
  }

  // ============================================================
  // HORN — conical taper extending LEFT
  //
  // Real horn anatomy:
  //   - Circular cross-section (round rod that tapers to a point)
  //   - Slopes very slightly downward from root to tip
  //   - Root attaches at left edge of face plate
  //   - Top edge is a gentle downward curve
  //   - Bottom edge curves down more steeply (the underside tapers)
  //   - Tip is blunt (not razor-sharp in practice)
  // ============================================================
  {
    const hornGrad = ctx.createLinearGradient(-faceW / 2 - hornLen, 0, -faceW / 2, 0);
    hornGrad.addColorStop(0,   '#1E1E22');
    hornGrad.addColorStop(0.3, '#2E2E34');
    hornGrad.addColorStop(0.7, '#3C3C44');
    hornGrad.addColorStop(1,   '#484850');

    // The horn root starts at the left edge of the face plate
    const hornRootX = -faceW / 2;
    const hornTipX  = hornRootX - hornLen;

    // Root top/bottom Y (at face plate)
    const hornRootTopY    = faceTop;                       // flush with face top
    const hornRootBotY    = faceTop + hornBaseH;           // flush with face bottom

    // Tip Y — the horn droops slightly downward toward the tip
    const hornTipTopY     = faceTop + (hornBaseH - hornTipH) * 0.6 + hornBaseH * 0.18;
    const hornTipBotY     = hornTipTopY + hornTipH;

    ctx.beginPath();
    // Start at horn root top (where it meets the face plate left edge, top)
    ctx.moveTo(hornRootX, hornRootTopY);

    // Top edge of horn — gentle downward curve to tip
    ctx.bezierCurveTo(
      hornRootX - hornLen * 0.40, hornRootTopY + (hornTipTopY - hornRootTopY) * 0.2,
      hornRootX - hornLen * 0.75, hornTipTopY - 4,
      hornTipX, hornTipTopY,
    );

    // Rounded tip (small arc connecting top to bottom of tip)
    ctx.quadraticCurveTo(
      hornTipX - hornTipH * 0.8,
      (hornTipTopY + hornTipBotY) / 2,
      hornTipX, hornTipBotY,
    );

    // Bottom edge of horn — curves back steeply to root
    // The underside tapers more aggressively (horn is rounder on top)
    ctx.bezierCurveTo(
      hornRootX - hornLen * 0.70, hornTipBotY + 5,
      hornRootX - hornLen * 0.30, hornRootBotY - 2,
      hornRootX, hornRootBotY,
    );

    ctx.closePath();
    ctx.fillStyle = hornGrad;
    ctx.fill();

    // Top highlight edge of horn
    ctx.beginPath();
    ctx.moveTo(hornRootX, hornRootTopY);
    ctx.bezierCurveTo(
      hornRootX - hornLen * 0.40, hornRootTopY + (hornTipTopY - hornRootTopY) * 0.2,
      hornRootX - hornLen * 0.75, hornTipTopY - 4,
      hornTipX, hornTipTopY,
    );
    ctx.strokeStyle = 'rgba(100,100,115,0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Subtle center-line groove along the top of the horn (visual roundness cue)
    ctx.beginPath();
    ctx.moveTo(hornRootX - 10, hornRootTopY + 3);
    ctx.bezierCurveTo(
      hornRootX - hornLen * 0.35, hornRootTopY + 5,
      hornRootX - hornLen * 0.70, hornTipTopY + 2,
      hornTipX + 8, hornTipTopY + 2,
    );
    ctx.strokeStyle = 'rgba(0,0,0,0.30)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // ============================================================
  // FACE PLATE — the flat hardened-steel working surface
  //
  // This is the most-used part of the anvil; it's a harder grade of
  // steel than the body, so it's slightly lighter/shinier.
  // Edges have a visible chamfer/radius.
  // ============================================================
  {
    // Face plate spans the full width of the top — from heel right edge to
    // where the horn begins (but the working face is just the flat center section)
    const faceLeft  = -faceW / 2;
    const faceRight =  faceW / 2;

    // Gradient: brighter in center (worn/polished), darker at edges
    const faceGrad = ctx.createLinearGradient(faceLeft, faceTop, faceRight, faceTop);
    faceGrad.addColorStop(0,    '#2C2C34');
    faceGrad.addColorStop(0.10, '#424248');
    faceGrad.addColorStop(0.30, '#585864');
    faceGrad.addColorStop(0.50, '#636370');  // brightest at center
    faceGrad.addColorStop(0.70, '#585864');
    faceGrad.addColorStop(0.90, '#404048');
    faceGrad.addColorStop(1,    '#2A2A32');

    // Face plate with slightly rounded corners using arc
    const radius = 4; // subtle chamfer
    ctx.beginPath();
    ctx.moveTo(faceLeft + radius, faceTop);
    ctx.lineTo(faceRight - radius, faceTop);
    ctx.arcTo(faceRight, faceTop, faceRight, faceTop + radius, radius);
    ctx.lineTo(faceRight, faceBot - radius);
    ctx.arcTo(faceRight, faceBot, faceRight - radius, faceBot, radius);
    ctx.lineTo(faceLeft + radius, faceBot);
    ctx.arcTo(faceLeft, faceBot, faceLeft, faceBot - radius, radius);
    ctx.lineTo(faceLeft, faceTop + radius);
    ctx.arcTo(faceLeft, faceTop, faceLeft + radius, faceTop, radius);
    ctx.closePath();
    ctx.fillStyle = faceGrad;
    ctx.fill();

    // Polished top surface specular highlight (slightly off-center, mimics overhead light)
    ctx.beginPath();
    ctx.moveTo(faceLeft + 12, faceTop + 3);
    ctx.lineTo(faceRight - 12, faceTop + 3);
    ctx.strokeStyle = 'rgba(160,160,175,0.18)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Bottom edge shadow line
    ctx.beginPath();
    ctx.moveTo(faceLeft, faceBot);
    ctx.lineTo(faceRight, faceBot);
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // ============================================================
  // HEEL — square rear protrusion to the RIGHT of the face plate
  //
  // The heel is slightly below the face plane (it's a separate section).
  // It holds the hardy hole (square) and pritchel hole (round).
  // ============================================================
  {
    const heelLeft  = faceW / 2;
    const heelRight = faceW / 2 + heelW;

    // Heel is same height as face but slightly darker (less polished)
    const heelGrad = ctx.createLinearGradient(heelLeft, 0, heelRight, 0);
    heelGrad.addColorStop(0,   '#484852');
    heelGrad.addColorStop(0.4, '#404048');
    heelGrad.addColorStop(1,   '#282830');

    const hRadius = 3;
    ctx.beginPath();
    ctx.moveTo(heelLeft, faceTop);           // top-left of heel (joins face plate)
    ctx.lineTo(heelRight - hRadius, faceTop);
    ctx.arcTo(heelRight, faceTop, heelRight, faceTop + hRadius, hRadius);
    ctx.lineTo(heelRight, faceBot - hRadius);
    ctx.arcTo(heelRight, faceBot, heelRight - hRadius, faceBot, hRadius);
    ctx.lineTo(heelLeft, faceBot);
    ctx.closePath();
    ctx.fillStyle = heelGrad;
    ctx.fill();

    // Heel top edge
    ctx.beginPath();
    ctx.moveTo(heelLeft, faceTop);
    ctx.lineTo(heelRight - hRadius, faceTop);
    ctx.strokeStyle = 'rgba(100,100,115,0.20)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Hardy hole (square cutout, ~⅔ from heel left edge) ---
    // In reality these are through-holes; we render them as dark insets
    const hardyX = heelLeft + (heelW - hardySize) * 0.38;
    const hardyY = faceTop + (faceH - hardySize) / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(hardyX, hardyY, hardySize, hardySize);
    // Hardy hole inner highlight (slight depth illusion)
    ctx.strokeStyle = 'rgba(30,30,35,1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(hardyX + 1, hardyY + 1, hardySize - 2, hardySize - 2);

    // --- Pritchel hole (round, near heel tip) ---
    const pritchX = heelLeft + heelW * 0.78;
    const pritchY = faceTop + faceH / 2;
    ctx.beginPath();
    ctx.arc(pritchX, pritchY, pritchRad, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pritchX, pritchY, pritchRad - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(25,25,30,0.9)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================
// HAMMER DRAWING — cross-peen blacksmith hammer
//
// The hammer swings in an ARC from a pivot point off-screen upper-right.
// Only the forearm/lower handle + head is visible.
//
// Parameters:
//   pivotX, pivotY — off-screen pivot point (simulates the blacksmith's shoulder)
//   armLen         — distance from pivot to hammer head center
//   angle          — current swing angle in radians
//                    (0 = pointing straight down, negative = cocked back)
// ============================================================
function drawHammer(
  ctx: CanvasRenderingContext2D,
  pivotX: number,
  pivotY: number,
  armLen: number,
  angle: number,   // radians: 0 = vertical (straight down)
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // --- Compute positions ---
  // The hammer handle extends FROM the pivot outward at `angle`
  // angle=0 means the handle hangs straight down; negative angles swing it back (clockwise = forward swing)
  // We only draw the LOWER portion of the arm (from partial-arm-start to head)

  // Visible handle starts 30% of armLen from pivot (rest is off-screen or above frame)
  const visibleStart = 0.30;  // fraction of armLen where visible portion begins

  // Compute the handle endpoint at full arm length
  const headCX = pivotX + Math.cos(angle) * armLen;
  const headCY = pivotY + Math.sin(angle) * armLen;

  // Compute the handle start (partway up the arm)
  const handleStartX = pivotX + Math.cos(angle) * (armLen * visibleStart);
  const handleStartY = pivotY + Math.sin(angle) * (armLen * visibleStart);

  // Perpendicular direction to the arm (for handle width)
  const perpX = -Math.sin(angle);
  const perpY =  Math.cos(angle);

  const handleW = 13; // handle width in pixels
  const headW   = 78; // hammer head width (perpendicular to handle axis)
  const headLen = 54; // hammer head length (along handle axis)

  // Handle corners
  const h0x = handleStartX + perpX * handleW / 2;
  const h0y = handleStartY + perpY * handleW / 2;
  const h1x = handleStartX - perpX * handleW / 2;
  const h1y = handleStartY - perpY * handleW / 2;

  // Where the head center is (a bit back from the tip — handle doesn't go all the way)
  const headCenterX = pivotX + Math.cos(angle) * (armLen - headLen * 0.38);
  const headCenterY = pivotY + Math.sin(angle) * (armLen - headLen * 0.38);

  // === WOODEN HANDLE ===
  {
    const handleGrad = ctx.createLinearGradient(
      headCX + perpX * handleW, headCY + perpY * handleW,
      headCX - perpX * handleW, headCY - perpY * handleW,
    );
    handleGrad.addColorStop(0,    '#3A2214');
    handleGrad.addColorStop(0.20, '#5C4530');
    handleGrad.addColorStop(0.45, '#6E5238');
    handleGrad.addColorStop(0.65, '#604A30');
    handleGrad.addColorStop(0.85, '#4A3320');
    handleGrad.addColorStop(1,    '#2C1A0C');

    ctx.beginPath();
    ctx.moveTo(h0x, h0y);
    ctx.lineTo(h1x, h1y);
    // The handle widens slightly toward the head end (natural taper)
    const h2x = headCenterX - perpX * (handleW * 0.65);
    const h2y = headCenterY - perpY * (handleW * 0.65);
    const h3x = headCenterX + perpX * (handleW * 0.65);
    const h3y = headCenterY + perpY * (handleW * 0.65);
    ctx.lineTo(h2x, h2y);
    ctx.lineTo(h3x, h3y);
    ctx.closePath();
    ctx.fillStyle = handleGrad;
    ctx.fill();

    // Wood grain lines (subtle streaks along the handle)
    ctx.save();
    ctx.clip(); // clip to handle shape so grains don't leak out
    for (let g = 0; g < 5; g++) {
      const t = (g + 0.5) / 5;
      const gx0 = handleStartX + perpX * (handleW * (t - 0.5));
      const gy0 = handleStartY + perpY * (handleW * (t - 0.5));
      const gx1 = headCenterX  + perpX * (handleW * (t - 0.5) * 0.65);
      const gy1 = headCenterY  + perpY * (handleW * (t - 0.5) * 0.65);
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx1, gy1);
      ctx.strokeStyle = g % 2 === 0 ? 'rgba(0,0,0,0.14)' : 'rgba(100,70,40,0.10)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  // === IRON HAMMER HEAD ===
  // The head is a roughly rectangular block oriented perpendicular to the handle.
  // One face (the poll/flat striking face) points downward; the other end
  // is the cross-peen (a ridge, slightly narrower).
  {
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(0,0,0,0.55)';

    // Head corners — rectangle centered at headCenterX/Y, oriented along the handle axis
    // The head's length axis is ALONG the handle; width axis is PERPENDICULAR
    const axX = Math.cos(angle);   // unit vector along arm (toward head)
    const axY = Math.sin(angle);

    // Four corners of the hammer head block
    const hfl = headLen * 0.62;  // front (toward impact face) length from center
    const hbl = headLen * 0.38;  // back (toward peen) length from center
    const hw2 = headW / 2;       // half-width

    // Front-left, front-right, back-right, back-left
    const flx = headCenterX + axX * hfl - perpX * hw2;
    const fly = headCenterY + axY * hfl - perpY * hw2;
    const frx = headCenterX + axX * hfl + perpX * hw2;
    const fry = headCenterY + axY * hfl + perpY * hw2;
    const brx = headCenterX - axX * hbl + perpX * hw2;
    const bry = headCenterY - axY * hbl + perpY * hw2;
    const blx = headCenterX - axX * hbl - perpX * hw2;
    const bly = headCenterY - axY * hbl - perpY * hw2;

    // Main head gradient — across the width (perpendicular to swing)
    const headGrad = ctx.createLinearGradient(
      headCenterX - perpX * hw2, headCenterY - perpY * hw2,
      headCenterX + perpX * hw2, headCenterY + perpY * hw2,
    );
    headGrad.addColorStop(0,    '#1E1E24');
    headGrad.addColorStop(0.12, '#32323C');
    headGrad.addColorStop(0.40, '#4A4A56');
    headGrad.addColorStop(0.58, '#525260');  // highlight center
    headGrad.addColorStop(0.80, '#3A3A44');
    headGrad.addColorStop(1,    '#1C1C22');

    ctx.beginPath();
    ctx.moveTo(flx, fly);
    ctx.lineTo(frx, fry);
    ctx.lineTo(brx, bry);
    ctx.lineTo(blx, bly);
    ctx.closePath();
    ctx.fillStyle = headGrad;
    ctx.fill();

    ctx.restore();

    // Impact face (front face of head — the flat striking surface)
    // Slightly lighter/worn from use
    const faceGrad2 = ctx.createLinearGradient(
      flx, fly, frx, fry,
    );
    faceGrad2.addColorStop(0,   '#282830');
    faceGrad2.addColorStop(0.5, '#565664');
    faceGrad2.addColorStop(1,   '#262830');
    ctx.beginPath();
    // Impact face is a narrow strip at the front of the head
    const faceDepth = 6;
    const iflx = flx - axX * faceDepth;
    const ifly = fly - axY * faceDepth;
    const ifrx = frx - axX * faceDepth;
    const ifry = fry - axY * faceDepth;
    ctx.moveTo(flx, fly);
    ctx.lineTo(frx, fry);
    ctx.lineTo(ifrx, ifry);
    ctx.lineTo(iflx, ifly);
    ctx.closePath();
    ctx.fillStyle = faceGrad2;
    ctx.fill();

    // Cross-peen wedge on back of head (the ridge used for drawing out metal)
    // The peen tapers to a line along the perpendicular axis
    const peenTaper = hw2 * 0.42; // peen is narrower than full head width
    const peenDepth = 8;
    const pblx = blx + axX * peenDepth;
    const pbly = bly + axY * peenDepth;
    const pbrx = brx + axX * peenDepth;
    const pbry = bry + axY * peenDepth;
    const peenTipLx = headCenterX - axX * hbl - perpX * peenTaper;
    const peenTipLy = headCenterY - axY * hbl - perpY * peenTaper;
    const peenTipRx = headCenterX - axX * hbl + perpX * peenTaper;
    const peenTipRy = headCenterY - axY * hbl + perpY * peenTaper;

    ctx.beginPath();
    ctx.moveTo(pblx, pbly);
    ctx.lineTo(pbrx, pbry);
    ctx.lineTo(peenTipRx, peenTipRy);
    ctx.lineTo(blx, bly);
    ctx.lineTo(brx, bry);
    ctx.lineTo(peenTipLx, peenTipLy); // wait — let me simplify the peen
    ctx.closePath();

    // Simpler peen: just a slight bevel indicating the back wedge shape
    ctx.beginPath();
    ctx.moveTo(blx, bly);
    ctx.lineTo(brx, bry);
    const peenMidX = (blx + brx) / 2 - axX * peenDepth;
    const peenMidY = (bly + bry) / 2 - axY * peenDepth;
    ctx.lineTo(peenMidX + perpX * peenTaper, peenMidY + perpY * peenTaper);
    ctx.lineTo(peenMidX - perpX * peenTaper, peenMidY - perpY * peenTaper);
    ctx.closePath();

    const peenGrad = ctx.createLinearGradient(blx, bly, peenMidX, peenMidY);
    peenGrad.addColorStop(0, '#303038');
    peenGrad.addColorStop(1, '#1A1A20');
    ctx.fillStyle = peenGrad;
    ctx.fill();

    // Top-edge highlight of head
    ctx.beginPath();
    ctx.moveTo(blx + perpX * 2, bly + perpY * 2);
    ctx.lineTo(brx + perpX * 2, bry + perpY * 2);
    ctx.strokeStyle = 'rgba(130,130,148,0.20)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================
// STRIKE GLOW — hot orange-white glow at impact point on anvil face
// ============================================================
function drawStrikeGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  intensity: number,  // 0–1
) {
  if (intensity <= 0) return;
  ctx.save();

  // Outer warm ambient glow (elliptical — spreads wider than tall on the face)
  const outerR = 90 * intensity;
  const outer  = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
  outer.addColorStop(0,   `rgba(255, 160, 20,  ${0.40 * intensity})`);
  outer.addColorStop(0.4, `rgba(200,  80,  5,  ${0.18 * intensity})`);
  outer.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.ellipse(cx, cy, outerR, outerR * 0.50, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hot white-orange core at impact point
  ctx.save();
  ctx.shadowBlur  = 28 * intensity;
  ctx.shadowColor = `rgba(255, 200, 60, ${0.85 * intensity})`;
  const innerR = 30 * intensity;
  const inner  = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
  inner.addColorStop(0,    `rgba(255, 255, 210, ${0.98 * intensity})`);
  inner.addColorStop(0.20, `rgba(255, 240, 140, ${0.90 * intensity})`);
  inner.addColorStop(0.55, `rgba(255, 160,  30, ${0.65 * intensity})`);
  inner.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.ellipse(cx, cy, innerR, innerR * 0.60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// ============================================================
// SPARKS — update physics and render golden/copper particles
// ============================================================
function drawSparks(
  ctx: CanvasRenderingContext2D,
  sparks: Spark[],
) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    // Physics update
    s.x  += s.vx;
    s.y  += s.vy;
    s.vy += 0.15;   // gravity
    s.vx *= 0.97;   // horizontal drag
    s.life -= 0.024;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }

    // Draw spark
    ctx.save();
    ctx.shadowBlur  = 7;
    ctx.shadowColor = `rgba(255, 180, 40, ${s.life * 0.55})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
    // Color transitions from white-yellow → copper-gold → dim orange as life fades
    const r = 255;
    const g = Math.round(180 + s.brightness * 75);
    const b = Math.round(40  + s.brightness * 55);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.life * 0.92})`;
    ctx.fill();
    // Bright white-yellow core while still fresh
    if (s.life > 0.38) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.28 * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 210, ${(s.life - 0.38) * 1.6})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

// ============================================================
// MAIN SCENE — all phases driven by scroll progress 0–1
// ============================================================
function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  progress: number,
  time: number,
  sparks: Spark[],
) {
  ctx.clearRect(0, 0, w, h);
  if (progress <= 0.01) return;

  // ============================================================
  // LAYOUT ANCHORS
  // The anvil sits roughly centered in the right ~55% of the canvas.
  // anvilCX  = horizontal center of the anvil body (throat centerline)
  // anvilTopY = y-coordinate of the TOP of the anvil face plate
  // ============================================================
  const anvilCX   = w * 0.62;
  const anvilTopY = h * 0.50;
  const anvilScale = 0.88;  // scale down slightly so full anvil fits with horn

  // Impact point on the anvil face (where hammer strikes)
  // Slightly left of center (where a blacksmith would aim, between center and horn)
  const impactX = anvilCX - 18;
  const impactY = anvilTopY;

  // ============================================================
  // PHASE TIMINGS
  // ============================================================

  // 0.00–0.15: Anvil fades/scales in
  const anvilAlpha = progress < 0.15
    ? Math.min(1, progress / 0.15)
    : progress > 0.85
      ? Math.max(0, 1 - (progress - 0.85) / 0.15)
      : 1;

  const anvilScaleMod = progress < 0.15
    ? 0.88 + (progress / 0.15) * 0.12
    : 1.0;

  // 0.15–0.35: Hammer arm swings into view (raised/cocked position)
  const hammerAppear = progress < 0.15 ? 0 : Math.min(1, (progress - 0.15) / 0.20);

  // ============================================================
  // HAMMER PIVOT & ARC SETUP
  //
  // Pivot is DIRECTLY ABOVE the impact point (slightly right) so the
  // hammer swings straight DOWN onto the anvil face — like a blacksmith
  // standing behind the anvil bringing the hammer down vertically.
  //
  // armLen computed from pivot→impact distance (guaranteed to reach).
  // angleImpact = atan2 from pivot to impact (guaranteed to land).
  // ============================================================
  const pivotX = impactX + 30;          // nearly directly above impact, tiny offset right
  const pivotY = h * -0.20;             // well above viewport (off-screen top)

  // Arm length = exact distance from pivot to impact point
  const dxImpact = impactX - pivotX;
  const dyImpact = impactY - pivotY;
  const armLen   = Math.sqrt(dxImpact * dxImpact + dyImpact * dyImpact);

  // Impact angle: direction from pivot straight down to impact point
  const angleImpact = Math.atan2(dyImpact, dxImpact);
  // Cocked back: rotated back (counter-clockwise) from impact — hammer raised up
  const angleCocked = angleImpact - 0.45;
  // Bounce/lift after strike: slightly raised from impact
  const angleLift   = angleImpact - 0.22;

  // 0.35–0.45: FIRST STRIKE — hammer arcs down to anvil
  const strike1 = progress < 0.35 ? 0 : Math.min(1, (progress - 0.35) / 0.10);
  // 0.45–0.55: Hammer bounces up
  const lift1   = progress < 0.45 ? 0 : Math.min(1, (progress - 0.45) / 0.10);
  // 0.55–0.70: SECOND STRIKE (bigger) — hammer swings down harder
  const strike2 = progress < 0.55 ? 0 : Math.min(1, (progress - 0.55) / 0.13);
  // 0.70–0.85: Hammer lifts, sparks trail off
  const lift2   = progress < 0.70 ? 0 : Math.min(1, (progress - 0.70) / 0.15);

  // Compute current hammer swing angle
  let hammerAngle: number;
  if (hammerAppear < 1) {
    // Swinging into view from above — starts very raised, settles to cocked rest
    const entryCocked = angleCocked - 0.40;
    const ease = 1 - Math.pow(1 - hammerAppear, 2);
    hammerAngle = entryCocked + (angleCocked - entryCocked) * ease;
  } else if (strike1 < 1) {
    // First strike: swing from cocked to impact angle (eased in for realism)
    const ease = 1 - Math.pow(1 - strike1, 3);
    hammerAngle = angleCocked + (angleImpact - angleCocked) * ease;
  } else if (lift1 < 1) {
    // Bounce back from first strike
    const ease = Math.pow(lift1, 2);
    hammerAngle = angleImpact + (angleLift - angleImpact) * ease;
  } else if (strike2 < 1) {
    // Second strike: starts from lift position, swings harder/deeper
    const angleImpact2 = angleImpact + 0.04; // slightly deeper impact
    const ease = 1 - Math.pow(1 - strike2, 3);
    hammerAngle = angleLift + (angleImpact2 - angleLift) * ease;
  } else {
    // Lift after second strike + fade
    const ease = Math.pow(lift2, 0.7);
    hammerAngle = (angleImpact + 0.04) + (angleLift + 0.06 - (angleImpact + 0.04)) * ease;
  }

  // ============================================================
  // STRIKE GLOW INTENSITY
  // Peaks sharply at impact, decays during lift
  // ============================================================
  let glowIntensity = 0;
  // First strike glow
  if (strike1 >= 0.88 && lift1 < 1) {
    glowIntensity = Math.max(0, 1 - lift1 * 2.2);
  }
  // Second strike glow (brighter — harder blow)
  if (strike2 >= 0.88 && lift2 < 1) {
    const g2 = Math.max(0, 1 - lift2 * 2.0) * 1.25;
    glowIntensity = Math.max(glowIntensity, g2);
  }
  glowIntensity = Math.min(1, glowIntensity);

  // ============================================================
  // AMBIENT SCREEN GLOW during strikes
  // ============================================================
  if (glowIntensity > 0 && anvilAlpha > 0) {
    const ambR    = w * 0.40 * glowIntensity;
    const ambient = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, ambR);
    ambient.addColorStop(0,   `rgba(255, 120, 20, ${0.14 * glowIntensity * anvilAlpha})`);
    ambient.addColorStop(0.5, `rgba(200,  60,  5, ${0.07 * glowIntensity * anvilAlpha})`);
    ambient.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, w, h);
  }

  // ============================================================
  // DRAW: Anvil
  // ============================================================
  drawAnvil(ctx, anvilCX, anvilTopY, anvilScale * anvilScaleMod, anvilAlpha);

  // ============================================================
  // DRAW: Strike glow on anvil face
  // ============================================================
  drawStrikeGlow(ctx, impactX, impactY + 4, glowIntensity * anvilAlpha);

  // ============================================================
  // SPAWN SPARKS at strike moments
  // ============================================================
  const isStriking1 = strike1 > 0.88 && lift1 < 0.28;
  const isStriking2 = strike2 > 0.88 && lift2 < 0.35;

  if ((isStriking1 || isStriking2) && time % 2 === 0) {
    const burstCount = isStriking2 ? 9 : 6;
    for (let i = 0; i < burstCount; i++) {
      // Sparks burst outward from impact point — biased UPWARD and to the sides
      // Real smithing sparks fly mostly upward and away from the strike
      const angle = (Math.random() * Math.PI * 1.6) - Math.PI * 1.3; // mostly upper hemisphere
      const speed = 3.0 + Math.random() * 6.0;
      sparks.push({
        x:          impactX + (Math.random() - 0.5) * 14,
        y:          impactY - 2,
        vx:         Math.cos(angle) * speed,
        vy:         Math.sin(angle) * speed - 3.0,  // strong upward bias
        life:       0.6 + Math.random() * 0.5,
        size:       1.4 + Math.random() * 3.0,
        brightness: 0.55 + Math.random() * 0.45,
      });
    }
  }

  // Trickle sparks while glow is still active (cooling sparks)
  if (glowIntensity > 0.18 && time % 3 === 0) {
    sparks.push({
      x:          impactX + (Math.random() - 0.5) * 22,
      y:          impactY - 3,
      vx:         (Math.random() - 0.5) * 2.5,
      vy:         -(1.8 + Math.random() * 2.8),
      life:       0.4 + Math.random() * 0.32,
      size:       0.9 + Math.random() * 1.8,
      brightness: 0.5 + Math.random() * 0.38,
    });
  }

  // ============================================================
  // DRAW: Sparks (drawn AFTER anvil but BEFORE hammer)
  // ============================================================
  drawSparks(ctx, sparks);

  // ============================================================
  // DRAW: Hammer (topmost layer)
  // ============================================================
  if (hammerAppear > 0) {
    const hammerAlpha = progress > 0.85
      ? Math.max(0, 1 - (progress - 0.85) / 0.15) * anvilAlpha
      : hammerAppear;
    drawHammer(ctx, pivotX, pivotY, armLen, hammerAngle, hammerAlpha);
  }
}

// ============================================================
// COMPONENT
// ============================================================
export function IronAnvilSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const stateRef   = useRef({ progress: 0, time: 0, sparks: [] as Spark[] });
  const rafRef     = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr    = Math.min(window.devicePixelRatio, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const s  = stateRef.current;
      const cw = canvas.width  / Math.min(window.devicePixelRatio, 2);
      const ch = canvas.height / Math.min(window.devicePixelRatio, 2);
      s.time += 1;
      drawScene(ctx, cw, ch, s.progress, s.time, s.sparks);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useGSAP((gsap, ScrollTrigger) => {
    if (!sectionRef.current || !textRef.current) return;

    const textElements = textRef.current.querySelectorAll('.why-text-item');
    const proxy = { progress: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top top',
        end:     '+=180%',
        pin:     true,
        scrub:   0.8,
      },
    });

    tl.to(proxy, {
      progress: 1,
      duration: 0.9,
      ease:     'none',
      onUpdate: () => { stateRef.current.progress = proxy.progress; },
    }, 0);

    textElements.forEach((el, i) => {
      tl.fromTo(el,
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.10, ease: 'power3.out' },
        0.28 + i * 0.06,
      );
    });

    tl.to(textRef.current,
      { opacity: 0, x: -20, duration: 0.10, ease: 'power2.in' },
      0.70,
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        {/* Text — left side.
            Mobile: full-width so text is fully readable.
            lg+: 42% so canvas has room on the right.
        */}
        <div ref={textRef} className="w-full lg:w-[42%] px-6 lg:pl-12 xl:pl-20 relative z-10">
          <span className="why-text-item block font-[family-name:var(--font-accent)] text-sm tracking-[0.2em] uppercase text-[var(--accent-iron-light)] mb-4 opacity-0">
            Our Purpose
          </span>
          <h2 className="why-text-item font-[family-name:var(--font-display)] text-[var(--text-h1)] text-[var(--text-primary)] leading-tight mb-6 opacity-0">
            Why Are We Here?
          </h2>
          {/* text-base on mobile (16px minimum for iOS no-zoom); text-lg on md+ */}
          <p className="why-text-item text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg opacity-0">
            Because faith that can&apos;t be questioned isn&apos;t faith — it&apos;s habit. Because the people sitting in pews deserve more than bumper-sticker theology. Because iron sharpens iron, and that means friction.
          </p>
          <p className="why-text-item text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg opacity-0">
            We&apos;re here to take the hardest doctrines of the Christian faith, lay them on the anvil, and strike until what&apos;s true rings clear.
          </p>
        </div>

        {/* Canvas — right side.
            Mobile: reduced opacity so it reads as a background texture behind the text.
            lg+: full opacity, constrained to right 58%.
        */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] pointer-events-none opacity-30 lg:opacity-100">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
