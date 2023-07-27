import { NoContentException } from '@common/exceptions/no-content.exception';
import { StringUtils } from '@common/helpers/types/string';

import { PageDTO, PageMetaDTO } from './pagination/page.dto';
import { getSkip, PageOptionsDTO } from './pagination/page-options.dto';

/**
 * Offset pagination
 * @example http://localhost:3333/users/?page=1&take=30&order=ASC&sort=createdAt&from=2023-07-22&to=2023-07-26&deleted=false&where=id&is=1
 */
export const Pagination = {
  paginate: <T>(pageOptionsDTO: PageOptionsDTO, total: number, results: any[]): PageDTO<T> => {
    const pageMetaDTO = new PageMetaDTO({ pageOptionsDTO, total });
    const lastPage = pageMetaDTO.lastPage;

    results.map((each) => {
      if (each['password']) {
        delete each['password'];

        return each;
      }
    });

    if (lastPage >= pageMetaDTO.page) {
      return new PageDTO(results, pageMetaDTO);
    }

    throw new NoContentException();
  },

  getQuery: (pageOptionsDTO: PageOptionsDTO) => {
    const { take, page, sort, order, where, is, from, to, deleted } = pageOptionsDTO;
    const skip = getSkip(page, take);

    /* Prepare the query objects */
    const query: any = {};
    const deepQuery: any = [];

    query.take = take;
    query.skip = skip;

    query.where = {
      deletedAt: deleted
        ? {
            not: null,
          }
        : null,
    };

    if (where && is) {
      /* Filter created_at greater than or equal */
      deepQuery.push({
        [where]: StringUtils.stringOrNumber(is),
      });
    }

    if (from) {
      /* Filter created_at greater than or equal */
      deepQuery.push({
        createdAt: {
          gte: new Date(from),
        },
      });
    }

    if (to) {
      /* Filter created_at less than or equal */
      deepQuery.push({
        createdAt: {
          lte: new Date(to),
        },
      });
    }

    query.orderBy = [
      {
        [sort]: order.toLowerCase(),
      },
    ];

    /* Here we combine our where with nested queries */
    query.where = {
      ...query.where,
      AND: [...deepQuery],
    };

    return query;
  },
};
