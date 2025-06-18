package com.softlink.springboot.transport_task.repository;

import com.softlink.springboot.transport_task.entity.TransportTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportTaskRepository extends JpaRepository<TransportTask, Integer> {



}
