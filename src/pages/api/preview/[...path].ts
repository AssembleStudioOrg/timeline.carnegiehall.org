import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.setPreviewData({});
  res.redirect(
    307,
    req.query.path ? `/${(req.query.path as string[]).join('/')}` : '/'
  );
}
