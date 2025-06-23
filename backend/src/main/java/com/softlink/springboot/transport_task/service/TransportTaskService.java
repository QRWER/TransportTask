package com.softlink.springboot.transport_task.service;

import com.softlink.springboot.transport_task.entity.TransportTask;
import com.softlink.springboot.transport_task.repository.TransportTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransportTaskService {

    @Autowired
    private TransportTaskRepository transportTaskRepository;

    public List<TransportTask> getAll(){
        return transportTaskRepository.findAll();
    }

    public List<TransportTask> get10Desc(){
        return transportTaskRepository.findTop10ByOrderByIdDesc();
    }

    public Optional<TransportTask> getById(int id){
        return transportTaskRepository.findById(id);
    }

    public TransportTask save(TransportTask transportTask){
        return transportTaskRepository.save(transportTask);
    }
}
