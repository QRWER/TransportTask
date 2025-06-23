package com.softlink.springboot.transport_task.repository;

import com.softlink.springboot.transport_task.entity.TransportTask;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportTaskRepository extends JpaRepository<TransportTask, Integer> {
    List<TransportTask> findTop10ByOrderByIdDesc();
}
