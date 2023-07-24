import { NoContentException } from '@common/exceptions/no-content.exception';
import { StringUtils } from '@common/helpers/types/string';
import { PageOptionsDTO, getSkip } from './pagination/page-options.dto';
import { PageDTO, PageMetaDTO } from './pagination/page.dto';

/**
 * Offset pagination
 * @example http://localhost:3333/users/?page=1&take=20&order=ASC&sort=createdAt&where=id&is=10&from=2023-07-23&to=2023-07-23
 */
export const Pagination = {
  paginate: <T>(pageOptionsDTO: PageOptionsDTO, total: number, results: T[]): PageDTO<T> => {
    const pageMetaDTO = new PageMetaDTO({ pageOptionsDTO, total });
    const lastPage = pageMetaDTO.lastPage;

    if (lastPage >= pageMetaDTO.page) {
      return new PageDTO(results, pageMetaDTO);
    } else {
      throw new NoContentException();
    }
  },

  getQuery: (pageOptionsDTO: PageOptionsDTO) => {
    const { take, page, sort, order, where, is, from, to } = pageOptionsDTO;
    const skip = getSkip(page, take);

    /* Prepare the query objects */
    const query: any = {};
    const deepQuery: any = [];

    query.take = take;
    query.skip = skip;

    if (where && is) {
      query.where = {
        [where]: StringUtils.stringOrNumber(is),
      };
    }

    if (from) {
      /* Filter createdAt greater than or equal */
      deepQuery.push({
        createdAt: {
          gte: new Date(from),
        },
      });
    }

    if (to) {
      /* Filter createdAt less than or equal */
      deepQuery.push({
        createdAt: {
          lte: new Date(to),
        },
      });
    }

    if (sort && order) {
      query.orderBy = [
        {
          [sort]: order.toLowerCase(),
        },
      ];
    }

    /* Here we combine our where with nested queries */
    query.where = {
      ...query.where,
      AND: [...deepQuery],
    };

    return query;
  },
};
