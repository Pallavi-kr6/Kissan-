export async function calculateProfit(req, res) {
  try {
    const {
      landSize,              // acres
      fertilizerCostPerAcre, // ₹/acre
      seedCostPerAcre,       // ₹/acre
      labourCostPerAcre,     // ₹/acre
      sellingPricePerQuintal,// ₹/quintal
      yieldPerAcre           // quintals/acre
    } = req.body || {};

    function toNum(v) {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }

    const acres = Math.max(0, toNum(landSize));
    const fert = Math.max(0, toNum(fertilizerCostPerAcre));
    const seed = Math.max(0, toNum(seedCostPerAcre));
    const labour = Math.max(0, toNum(labourCostPerAcre));
    const price = Math.max(0, toNum(sellingPricePerQuintal));
    const ypa = Math.max(0, toNum(yieldPerAcre));

    // Per-acre calculations (as per brief)
    const perAcreCost = fert + seed + labour;
    const perAcreRevenue = price * ypa;
    const perAcreProfit = perAcreRevenue - perAcreCost;

    // Total for all acres
    const totalCost = perAcreCost * acres;
    const totalRevenue = perAcreRevenue * acres;
    const netProfit = totalRevenue - totalCost;

    return res.json({
      acres,
      perAcre: {
        cost: perAcreCost,
        revenue: perAcreRevenue,
        profit: perAcreProfit,
      },
      totals: {
        cost: totalCost,
        revenue: totalRevenue,
        profit: netProfit,
      },
    });
  } catch (err) {
    console.error('calculateProfit error:', err?.message);
    return res.status(500).json({ error: 'Failed to calculate' });
  }
}


