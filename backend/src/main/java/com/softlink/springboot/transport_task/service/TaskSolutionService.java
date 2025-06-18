package com.softlink.springboot.transport_task.service;

import com.softlink.springboot.transport_task.entity.Solution;
import com.softlink.springboot.transport_task.entity.TransportTask;
import com.softlink.springboot.transport_task.repository.TaskSolutionRepository;
import com.softlink.springboot.transport_task.repository.TransportTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskSolutionService {

    @Autowired
    private TaskSolutionRepository taskSolutionRepository;

    public List<Solution> getAll(){
        return taskSolutionRepository.findAll();
    }

    public Optional<Solution> getById(int id){
        return taskSolutionRepository.findById(id);
    }

    public Solution save(Solution solution){
        return taskSolutionRepository.save(solution);
    }
}
