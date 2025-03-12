package com.pinkfactory.genio.port.in;

import com.pinkfactory.genio.domain.JobCategory;
import java.util.List;

/**
 * @author <a href="mailto:oognuyh@gmail.com">oognuyh</a>
 */
public interface FindJobCategoriesUseCase {

    /**
     * Retrieves all job categories with their respective positions
     *
     * @return List of job categories with positions
     */
    List<JobCategory> findJobCategories();
}
