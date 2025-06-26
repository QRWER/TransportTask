package com.softlink.springboot.transport_task.repository;

import com.softlink.springboot.transport_task.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolutionRepository extends JpaRepository<Solution, Integer> {
}
