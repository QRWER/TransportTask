package com.softlink.springboot.transport_task.repository;

import com.softlink.springboot.transport_task.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskSolutionRepository extends JpaRepository<Solution, Integer> {
}
